import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../src/supabaseClient';
import { 
  Bot, 
  Send, 
  ArrowLeft, 
  Clock, 
  Database, 
  Globe, 
  MessageSquare, 
  Plus, 
  Activity, 
  Settings, 
  Cpu, 
  Compass, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { SourceDrawer } from '../../components/chat/SourceDrawer';
import { Source } from '../../components/chat/SourceCard';
import { ChatInput } from '../../components/chat/ChatInput';

interface Message {
  id?: string;
  sender: 'user' | 'agent';
  message: string;
  sources?: { source: string; score: number }[];
  created_at?: string;
}

interface Session {
  id: string;
  agent_id: string;
  session_name: string;
  created_at: string;
}

interface AgentDetails {
  id: string;
  name: string;
  description: string;
  role: string;
  avatar: string;
  status: string;
  system_prompt: string;
  created_at: string;
}

interface MemoryConfig {
  session_memory_enabled: boolean;
  long_term_memory_enabled: boolean;
  retention_period_days: string;
}

interface Channel {
  channel_type: string;
  status: string;
}

interface DocumentStat {
  file_name: string;
  file_type: string;
  chunk_count: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AgentPlayground() {
  const router = useRouter();
  const { id: agentId } = router.query;

  // State definitions
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [memory, setMemory] = useState<MemoryConfig | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [documents, setDocuments] = useState<DocumentStat[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('info');
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const getAuthHeaders = async (contentType?: string) => {
    const sessionRes = await supabase.auth.getSession();
    const token = sessionRes.data.session?.access_token;
    const headers: Record<string, string> = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch Agent Details, Stats, and Sessions
  useEffect(() => {
    if (!agentId) return;

    const fetchAgentInfo = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}`, { headers });
        const data = await res.json();
        if (data.success) {
          setAgent(data.agent);
          setMemory(data.memory);
          setChannels(data.channels);
          setDocuments(data.documents);
        }
      } catch (err) {
        console.error('Failed to fetch agent details', err);
      }
    };

    const fetchSessions = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions`, { headers });
        const sessionsData = await res.json();
        setSessions(sessionsData);
        if (sessionsData.length > 0) {
          setCurrentSessionId(sessionsData[0].id);
        } else {
          // Create a session if none exist
          handleCreateSession();
        }
      } catch (err) {
        console.error('Failed to fetch chat sessions', err);
      }
    };

    fetchAgentInfo();
    fetchSessions();
  }, [agentId]);

  // Fetch Session Messages when currentSessionId changes
  useEffect(() => {
    if (!agentId || !currentSessionId) return;

    const fetchMessages = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions/${currentSessionId}/messages`, { headers });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch session messages', err);
      }
    };

    fetchMessages();
  }, [agentId, currentSessionId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateSession = async () => {
    if (!agentId) return;
    try {
      const headers = await getAuthHeaders('application/json');
      const res = await fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions`, {
        method: 'POST',
        headers
      });
      const newSession = await res.json();
      if (newSession.id) {
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to create session', err);
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
      const headers = await getAuthHeaders('application/json');
      const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/chat`, {
        method: 'POST',
        headers,
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
                  // Final payload with sources and metadata
                  if (data.final.session_id && currentSessionId !== data.final.session_id) {
                    setCurrentSessionId(data.final.session_id);
                    // Refresh session list
                    getAuthHeaders().then(h => {
                      fetch(`${API_BASE_URL}/api/agents/${agentId}/sessions`, { headers: h })
                        .then(res => res.json())
                        .then(sessionsData => setSessions(sessionsData));
                    });
                  }
                  
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

  const totalChunks = documents.reduce((sum, doc) => sum + (doc.chunk_count || 0), 0);

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

  return (
    <>
      <Head>
        <title>{agent ? `${agent.name} Playground` : 'Agent Playground'} - Born AI OS</title>
      </Head>

      <div className="min-h-screen bg-[#070c15] text-white flex flex-col font-sans">
        {/* Navigation Bar */}
        <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-lg font-bold text-white tracking-tight">{agent?.name || 'Agent Playground'}</h1>
              </div>
              <p className="text-xs text-slate-500">{agent?.role || 'AI Agent'} • Playground Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              {agent?.status || 'Active'}
            </span>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Chat Session Manager (Sidebar) */}
          <aside className="w-64 border-r border-white/10 bg-slate-950/20 p-4 flex flex-col gap-4 overflow-y-auto">
            <button 
              onClick={handleCreateSession}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-2 mb-1">
                Active Sessions
              </span>
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 border transition-all ${
                    currentSessionId === session.id
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      : 'bg-white/0 border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-xs font-medium flex-1">
                    {session.session_name}
                  </span>
                </button>
              ))}
              {sessions.length === 0 && (
                <p className="text-slate-600 text-xs italic px-2">No past sessions</p>
              )}
            </div>
          </aside>

          {/* Center Column: Chat Interface */}
          <main className="flex-1 flex flex-col bg-[#080f1d] relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl pointer-events-none" />
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                  />
                ))}
              </AnimatePresence>
              

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Area */}
            {/* Chat Input Area */}
            <ChatInput 
              inputMessage={inputMessage} 
              setInputMessage={setInputMessage} 
              onSubmit={handleSendMessage} 
              isSending={isSending} 
            />
          </main>

          {/* Right Panel: Agent Configuration & Context Details */}
          <aside className="w-96 border-l border-white/10 bg-slate-950/30 flex flex-col overflow-hidden">
            {/* Panel Tabs */}
            <div className="flex border-b border-white/10 bg-slate-950/60">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'info' 
                    ? 'border-indigo-500 text-indigo-400 bg-white/5' 
                    : 'border-transparent text-slate-500 hover:text-white'
                }`}
              >
                Information
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'stats' 
                    ? 'border-indigo-500 text-indigo-400 bg-white/5' 
                    : 'border-transparent text-slate-500 hover:text-white'
                }`}
              >
                Stats
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div 
                    key="info-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role Description</h4>
                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-sm text-slate-300">
                        {agent?.description || 'Loading...'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Prompt</h4>
                      <div className="bg-slate-950 border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-400 h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {agent?.system_prompt || 'Loading...'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Website Embed Code</h4>
                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-sm text-slate-300 relative group">
                        <pre className="font-mono text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
{`<script>
  window.BORN_AI_AGENT_ID = "${agent?.id}";
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/widget.js" async></script>`}
                        </pre>
                        <button 
                          onClick={(e) => {
                            const btn = e.currentTarget;
                            navigator.clipboard.writeText(`<script>\n  window.BORN_AI_AGENT_ID = "${agent?.id}";\n</script>\n<script src="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/widget.js" async></script>`);
                            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                            setTimeout(() => {
                              btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                            }, 2000);
                          }}
                          className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
                          title="Copy Code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'stats' && (
                  <motion.div 
                    key="stats-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Knowledge base stats */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Knowledge Base Stats</h4>
                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-1.5"><Database className="w-4 h-4 text-purple-400" /> Documents</span>
                          <span className="font-semibold text-white">{documents.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-1.5"><Zap className="w-4 h-4 text-purple-400" /> Vector Chunks</span>
                          <span className="font-semibold text-white">{totalChunks}</span>
                        </div>
                      </div>
                    </div>

                    {/* Channels Configuration */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deployment Channels</h4>
                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-3">
                        {['website', 'whatsapp', 'telegram', 'voice', 'api'].map(c => {
                          const isConfigured = channels.some(chan => chan.channel_type === c);
                          return (
                            <div key={c} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-2.5 last:pb-0">
                              <span className="text-slate-400 capitalize">{c}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                isConfigured 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-slate-950 text-slate-600 border-white/5'
                              }`}>
                                {isConfigured ? 'Configured' : 'Offline'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Memory configuration */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Memory Config</h4>
                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Session Memory</span>
                          <span className={memory?.session_memory_enabled ? 'text-emerald-400' : 'text-slate-600'}>
                            {memory?.session_memory_enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Long-term Memory</span>
                          <span className={memory?.long_term_memory_enabled ? 'text-emerald-400' : 'text-slate-600'}>
                            {memory?.long_term_memory_enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        {memory?.long_term_memory_enabled && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Retention period</span>
                            <span className="text-white font-medium">{memory.retention_period_days} Days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

        </div>
      </div>
      <SourceDrawer source={selectedSource} onClose={() => setSelectedSource(null)} />
    </>
  );
}
