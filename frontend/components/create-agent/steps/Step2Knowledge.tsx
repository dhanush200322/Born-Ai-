import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentBackendPayload } from '../../../lib/types/agent';
import { FileText, Globe, MessageCircleQuestion, Database, Cloud, X, Plus, Sparkles } from 'lucide-react';

interface Props {
  payload: AgentBackendPayload;
  updatePayload: (data: Partial<AgentBackendPayload>) => void;
}

const sources = [
  { id: 'file', title: 'Upload Files', desc: 'PDF, DOCX, TXT', icon: FileText, comingSoon: false },
  { id: 'url', title: 'Website URL', desc: 'Crawl entire sites', icon: Globe, comingSoon: false },
  { id: 'faq', title: 'FAQ', desc: 'Manual Q&A pairs', icon: MessageCircleQuestion, comingSoon: false },
  { id: 'notion', title: 'Notion', desc: 'Sync workspaces', icon: Database, comingSoon: true },
  { id: 'drive', title: 'Google Drive', desc: 'Connect folders', icon: Cloud, comingSoon: true },
];

export default function Step2Knowledge({ payload, updatePayload }: Props) {
  const { files, website_urls, faqs } = payload.knowledge_base;
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // FAQ Modal states
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    if (urlInput.trim() && !website_urls.includes(urlInput.trim())) {
      updatePayload({
        knowledge_base: { ...payload.knowledge_base, website_urls: [...website_urls, urlInput.trim()] }
      });
      setUrlInput('');
    }
  };

  const removeUrl = (url: string) => {
    updatePayload({
      knowledge_base: { ...payload.knowledge_base, website_urls: website_urls.filter(u => u !== url) }
    });
  };

  const handleSourceClick = (id: string) => {
    if (id === 'file') {
      fileInputRef.current?.click();
    } else if (id === 'faq') {
      setShowFaqModal(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => {
        formData.append('files', file);
      });

      try {
        const { supabase } = await import('../../../src/supabaseClient');
        const sessionRes = await supabase.auth.getSession();
        const token = sessionRes.data.session?.access_token;

        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_BASE_URL}/api/agents/upload`, {
          method: 'POST',
          headers,
          body: formData
        });
        const data = await res.json();
        if (data.success && data.file_paths) {
          updatePayload({
            knowledge_base: { 
              ...payload.knowledge_base, 
              files: [...files, ...data.file_paths] 
            }
          });
        }
      } catch (err: any) {
        console.error('File upload failed', err.message || err);
        alert('File upload failed. Please ensure the backend server is running.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = (filePath: string) => {
    updatePayload({
      knowledge_base: { ...payload.knowledge_base, files: files.filter(f => f !== filePath) }
    });
  };

  const handleAddFaq = () => {
    if (faqQuestion.trim() && faqAnswer.trim()) {
      updatePayload({
        knowledge_base: {
          ...payload.knowledge_base,
          faqs: [...faqs, { question: faqQuestion.trim(), answer: faqAnswer.trim() }]
        }
      });
      setFaqQuestion('');
      setFaqAnswer('');
      setShowFaqModal(false);
    }
  };

  const removeFaq = (index: number) => {
    updatePayload({
      knowledge_base: { ...payload.knowledge_base, faqs: faqs.filter((_, i) => i !== index) }
    });
  };

  const getFileName = (path: string) => {
    // Extracts filename from windows or unix absolute paths
    return path.split('\\').pop()?.split('/').pop() || path;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Knowledge Base</h2>
        <p className="text-slate-400">Connect the data sources your agent will use to answer questions.</p>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.docx,.txt"
      />

      {/* Selected Sources Chips */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        <AnimatePresence>
          {website_urls.map(url => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={url}
              className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{url}</span>
              <button onClick={() => removeUrl(url)} className="hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {files.map(file => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={file}
              className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{getFileName(file)}</span>
              <button onClick={() => removeFile(file)} className="hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {faqs.map((faq, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={idx}
              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-sm flex items-center gap-2"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{faq.question}</span>
              <button onClick={() => removeFaq(idx)} className="hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {isUploading && (
            <div className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-full text-sm flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Uploading files...</span>
            </div>
          )}
          {website_urls.length === 0 && files.length === 0 && faqs.length === 0 && !isUploading && (
            <p className="text-sm text-slate-500 italic mt-2">No sources added yet.</p>
          )}
        </AnimatePresence>
      </div>

      {/* URL Input Area (Demo of adding source) */}
      <div className="flex gap-2">
        <input 
          type="url" 
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
        <button 
          onClick={addUrl}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-all font-medium"
        >
          Add URL
        </button>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sources.map(s => (
          <button
            key={s.id}
            onClick={() => handleSourceClick(s.id)}
            disabled={s.comingSoon}
            className={`p-5 rounded-2xl border text-left transition-all ${
              s.comingSoon 
                ? 'bg-slate-950 border-white/5 opacity-50 cursor-not-allowed' 
                : 'bg-slate-900 border-white/10 hover:border-purple-500/50 hover:bg-slate-800/80 group'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl ${s.comingSoon ? 'bg-white/5' : 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              {s.comingSoon && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider">
                  Soon
                </span>
              )}
            </div>
            <h3 className={`font-semibold mb-1 ${s.comingSoon ? 'text-slate-500' : 'text-white'}`}>{s.title}</h3>
            <p className="text-xs text-slate-500">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-emerald-400" />
                Add FAQ Pair
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Question</label>
                <input 
                  type="text" 
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="What is your return policy?"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Answer</label>
                <textarea 
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="We offer a 30-day money-back guarantee..."
                  rows={4}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowFaqModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddFaq}
                disabled={!faqQuestion.trim() || !faqAnswer.trim()}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add Q&A
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

