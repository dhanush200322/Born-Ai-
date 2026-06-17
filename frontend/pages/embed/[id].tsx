import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Bot, RotateCcw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatInput } from '../../components/chat/ChatInput';
import { Source } from '../../components/chat/SourceCard';
import { SourceDrawer } from '../../components/chat/SourceDrawer';

interface Message {
  id?: string;
  sender: 'user' | 'agent';
  message: string;
  sources?: { source: string; score: number }[];
  created_at?: string;
}

interface AgentDetails {
  id: string;
  name: string;
  description: string;
  role: string;
  avatar: string;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function EmbedChatWidget() {
  const router = useRouter();
  const { id: agentId } = router.query;

  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch Agent Details and initialize session
  useEffect(() => {
    if (!agentId) return;

    const fetchAgentInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}`);
        const data = await res.json();
        if (data.success) {
          setAgent(data.agent);
        }
      } catch (err) {
        console.error('Failed to fetch agent details for embed', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    const initializeSession = async () => {
      try {
        // Fetch existing sessions first
        const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions`);
        const sessionsData = await res.json();
        if (sessionsData.length > 0) {
          setCurrentSessionId(sessionsData[0].id);
        } else {
          // Create a new session if none exist
          const createRes = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const newSession = await createRes.json();
          if (newSession.id) {
            setCurrentSessionId(newSession.id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize session for embed', err);
      }
    };

    fetchAgentInfo();
    initializeSession();
  }, [agentId]);

  // Fetch Session Messages when currentSessionId changes
  useEffect(() => {
    if (!agentId || !currentSessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions/${currentSessionId}/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch session messages for embed', err);
      }
    };

    fetchMessages();
  }, [agentId, currentSessionId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset chat / create new session
  const handleResetSession = async () => {
    if (!agentId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const newSession = await res.json();
      if (newSession.id) {
        setCurrentSessionId(newSession.id);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to reset session', err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const text = textOverride || inputMessage.trim();
    if (!text || isSending || !agentId) return;

    setInputMessage('');
    setIsSending(true);

    // Optimistically append user message
    const tempUserMsg: Message = { sender: 'user', message: text };
    setMessages(prev => [...prev, tempUserMsg]);

    // Create an empty agent message to stream into
    setMessages(prev => [...prev, { sender: 'agent', message: '', sources: [] }]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          session_id: currentSessionId
        })
      });

      if (!response.ok) {
        throw new Error('Chat error');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder('utf-8');
      let done = false;
      let streamedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              try {
                const data = JSON.parse(dataStr);
                
                if (data.chunk) {
                  streamedText += data.chunk;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].message = streamedText;
                    return newMessages;
                  });
                } else if (data.final) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].message = data.final.answer;
                    newMessages[newMessages.length - 1].sources = data.final.sources;
                    return newMessages;
                  });
                } else if (data.error) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].message = `Error: ${data.error}`;
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].message === '') {
          newMessages[newMessages.length - 1].message = `Error: ${err.message || 'Unable to connect to the agent.'}`;
        }
        return newMessages;
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleRegenerate = async (index: number) => {
    let lastUserMessage = '';
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserMessage = messages[i].message;
        break;
      }
    }
    if (lastUserMessage) {
      await handleSendMessage(undefined, lastUserMessage);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070c15] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-purple-500 border-white/10 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{agent ? `Chat with ${agent.name}` : 'Embed Chat Widget'} - Born AI</title>
      </Head>

      <div className="flex flex-col h-screen bg-[#070c15] text-white overflow-hidden font-sans select-none relative">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Small Widget Header */}
        <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-md px-4 py-3 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-sm font-semibold text-white tracking-tight">{agent?.name || 'AI Assistant'}</h1>
              </div>
              <p className="text-[10px] text-slate-400">{agent?.role || 'Assistant'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleResetSession}
            className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 text-slate-500">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-300">How can I help you today?</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                {agent?.description || 'Ask me any questions related to this project.'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg.message} 
                  sender={msg.sender} 
                  agentName={agent?.name || 'Agent'}
                  sources={msg.sources as Source[] | undefined} 
                  onSourceClick={(source) => setSelectedSource(source)} 
                  onFollowUpClick={(q) => handleSendMessage(undefined, q)}
                  onRegenerate={() => handleRegenerate(index)}
                  isStreaming={msg.sender === 'agent' && index === messages.length - 1}
                  showSources={false}
                />
              ))}
            </AnimatePresence>
          )}
          

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="shrink-0 bg-slate-950/40 border-t border-white/10">
          <ChatInput 
            inputMessage={inputMessage} 
            setInputMessage={setInputMessage} 
            onSubmit={handleSendMessage} 
            isSending={isSending} 
          />
        </div>
      </div>

      <SourceDrawer source={selectedSource} onClose={() => setSelectedSource(null)} />
    </>
  );
}
