import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Link2 } from 'lucide-react';
import { Source } from './SourceCard';

interface SourceDrawerProps {
  source: Source | null;
  onClose: () => void;
}

export function SourceDrawer({ source, onClose }: SourceDrawerProps) {
  if (!source) return null;

  // Support both old and new schema
  const title = source.title || source.source?.split('\\').pop()?.split('/').pop() || source.source || 'Unknown';
  const type = source.type || 'docs';
  const confidence = source.confidence ?? Math.round((source.score || 0) * 100);
  
  const isUrl = type === 'website' || (source.source && source.source.startsWith('http'));
  const isFaq = type === 'faq' || (source.source && source.source.toLowerCase() === 'faq');
  
  const originalPath = source.original_filename || source.source || 'Unknown path';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm sm:hidden"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="relative w-full sm:w-[400px] h-full bg-[#070c15] border-l border-white/10 shadow-2xl flex flex-col pt-safe-top mt-auto sm:mt-0 rounded-t-3xl sm:rounded-none z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Source Details</h3>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 break-words">{title}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  confidence >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  confidence >= 80 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                  'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {confidence}% Match
                </span>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  {isUrl ? 'Website URL' : isFaq ? 'FAQ Pair' : 'Document'}
                </span>
              </div>
            </div>

            {isUrl && originalPath.startsWith('http') && (
              <a 
                href={originalPath} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open Original Link
              </a>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Relevant Excerpt
              </h4>
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 text-sm leading-relaxed text-slate-300 relative overflow-hidden group">
                {/* Glowing edge effect */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-50" />
                
                <p className="italic">
                  {source.preview || (
                    "The backend vector database currently returns the document reference and similarity score. " +
                    "In a production environment, the retrieved chunk text will be displayed here, allowing users to verify exactly which paragraph influenced the AI's response."
                  )}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Raw Path Reference</span>
                  <p className="text-xs text-slate-600 mt-1 break-all font-mono">{originalPath}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
