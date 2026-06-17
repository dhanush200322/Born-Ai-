import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Copy, RefreshCw, ThumbsUp, ThumbsDown, Share, Layers, Check, CheckCheck, Download, Search, FileText, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { SourceCard, Source } from './SourceCard';
import { MarkdownRenderers } from './MarkdownRenderers';

interface MessageProps {
  message: string;
  sender: 'user' | 'agent';
  agentName?: string;
  sources?: Source[];
  onSourceClick: (source: Source) => void;
  onFollowUpClick?: (question: string) => void;
  onRegenerate?: () => void;
  isStreaming?: boolean;
  showSources?: boolean;
  status?: 'sent' | 'delivered' | 'seen';
  agentState?: 'searching' | 'reading' | 'generating' | 'done';
}

export function ChatMessage({ 
  message, 
  sender, 
  agentName = 'Agent',
  sources, 
  onSourceClick, 
  onFollowUpClick,
  onRegenerate,
  isStreaming = false,
  showSources = true,
  status = 'seen',
  agentState = 'done'
}: MessageProps) {
  const isUser = sender === 'user';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  // Extract follow-ups from the message if they exist at the end
  let displayMessage = message;
  let followUps: string[] = [];
  
  const followUpMatch = message.match(/```json-followups\n?([\s\S]*?)```/);
  const inlineFollowUpMatch = message.match(/`json-followups\\?n?\s*(\[.*?\])\s*\\?n?`/);
  
  if (followUpMatch || inlineFollowUpMatch) {
    try {
      let rawJson = followUpMatch ? followUpMatch[1] : inlineFollowUpMatch![1];
      rawJson = rawJson.replace(/\\n/g, '').trim();
      followUps = JSON.parse(rawJson);
      displayMessage = message.replace(followUpMatch ? followUpMatch[0] : inlineFollowUpMatch![0], '').trim();
    } catch (e) {
      console.warn("Failed to parse follow-ups - invalid JSON");
    }
  }

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      if (document.execCommand('copy')) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(displayMessage).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopyText(displayMessage));
    } else {
      fallbackCopyText(displayMessage);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([displayMessage], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Response_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'AI Response', text: displayMessage }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const renderStatusIndicator = () => {
    if (agentState === 'done') return null;
    
    return (
      <div className="flex items-center gap-2 text-[15px] font-medium text-slate-400">
        {agentState === 'searching' && <><Search className="w-4 h-4 animate-pulse text-indigo-400" /> {agentName} is searching Knowledge Base...</>}
        {agentState === 'reading' && <><FileText className="w-4 h-4 animate-pulse text-amber-400" /> {agentName} is reading Documents...</>}
        {agentState === 'generating' && <><Cpu className="w-4 h-4 animate-pulse text-emerald-400" /> {agentName} is typing...</>}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-4 max-w-[900px] w-full mx-auto ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg mt-1 ${
        isUser 
          ? 'bg-purple-600 text-white' 
          : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white ring-1 ring-white/20'
      }`}>
        {isUser ? 'U' : <Bot className="w-4 h-4" />}
      </div>

      <div className={`flex-1 space-y-3 ${isUser ? 'flex flex-col items-end' : ''} min-w-0`} ref={messageRef}>
        
        <div className={`relative px-6 py-5 rounded-3xl ${
          isUser 
            ? 'bg-purple-600 text-white rounded-tr-sm shadow-xl' 
            : 'bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-100 rounded-tl-sm shadow-2xl'
        }`}>
          {isUser ? (
            <div className="flex flex-col gap-1 items-end">
              <p className="text-[15px] leading-relaxed whitespace-pre-line">{displayMessage}</p>
              {status && (
                <div className="text-white/60">
                  {status === 'sent' && <Check className="w-3.5 h-3.5" />}
                  {status === 'delivered' && <CheckCheck className="w-3.5 h-3.5" />}
                  {status === 'seen' && <CheckCheck className="w-3.5 h-3.5 text-blue-300" />}
                </div>
              )}
            </div>
          ) : (
            <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed break-words">
              {!displayMessage ? (
                renderStatusIndicator()
              ) : (
                <>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeHighlight, rehypeKatex]}
                    components={MarkdownRenderers as any}
                  >
                    {displayMessage + (isStreaming ? '▍' : '')}
                  </ReactMarkdown>
                </>
              )}
            </div>
          )}

          {/* Hover Actions (Agent only) */}
          {!isUser && !isStreaming && (
            <div className="absolute -bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-white/10 rounded-full shadow-lg flex items-center p-1 gap-1 z-10">
              <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors" title="Copy text">
                {copied ? <span className="text-[10px] px-1 font-medium text-emerald-400">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button onClick={handleShare} className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors" title="Share">
                <Share className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleDownload} className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors" title="Download Response">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => { setLiked(!liked); setDisliked(false); }} className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Helpful">
                <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-400 hover:text-emerald-400'}`} />
              </button>
              <button onClick={() => { setDisliked(!disliked); setLiked(false); }} className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Not Helpful">
                <ThumbsDown className={`w-3.5 h-3.5 ${disliked ? 'text-rose-400 fill-rose-400/20' : 'text-slate-400 hover:text-rose-400'}`} />
              </button>
              {onRegenerate && (
                <button onClick={onRegenerate} className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-indigo-400 transition-colors" title="Regenerate">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Follow-up Chips */}
        {!isUser && followUps.length > 0 && !isStreaming && (
          <div className="flex flex-wrap gap-2 mt-4">
            {followUps.map((q, i) => (
              <motion.button 
                key={i} 
                onClick={() => onFollowUpClick && onFollowUpClick(q)}
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.1 }}
                className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
              >
                {q}
              </motion.button>
            ))}
          </div>
        )}

        {/* Sources Section */}
        {false && showSources && !isUser && (sources?.length ?? 0) > 0 && (
          <div className="pt-2 overflow-hidden mt-2">
            <div className="flex items-center gap-2 mb-3 px-1 text-slate-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Retrieved Sources</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(sources || []).map((src, i) => (
                <SourceCard key={i} source={src} onClick={() => onSourceClick(src)} />
              ))}
            </div>
          </div>
        )}
        
        {/* Powered By Footer */}
        {!isUser && !isStreaming && (
          <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-2 px-2 uppercase text-right w-full">
            Powered by Born AI
          </div>
        )}
      </div>
    </motion.div>
  );
}
