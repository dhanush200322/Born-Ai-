import React from 'react';
import { FileText, Globe, MessageCircleQuestion, Book } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Source {
  id?: string;
  title?: string;
  type?: string;
  confidence?: number;
  preview?: string;
  original_filename?: string;
  // Fallback for older messages
  source?: string;
  score?: number;
}

interface SourceCardProps {
  source: Source;
  onClick: () => void;
}

export function SourceCard({ source, onClick }: SourceCardProps) {
  // Support both old and new schema
  const title = source.title || source.source?.split('\\').pop()?.split('/').pop() || source.source || 'Unknown';
  const type = source.type || 'docs';
  const confidence = source.confidence ?? Math.round((source.score || 0) * 100);
  
  const isUrl = type === 'website' || (source.source && source.source.startsWith('http'));
  const isFaq = type === 'faq' || (source.source && source.source.toLowerCase() === 'faq');
  
  let Icon = FileText;
  let label = title;
  
  if (isUrl) {
    Icon = Globe;
  } else if (isFaq) {
    Icon = MessageCircleQuestion;
    label = 'FAQ';
  } else if (label.toLowerCase().endsWith('.pdf') || source.original_filename?.toLowerCase().endsWith('.pdf')) {
    Icon = Book;
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative flex items-center gap-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-left w-full sm:w-auto min-w-[200px]"
    >
      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
          {label}
        </div>
        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
          Confidence
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
            confidence >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
            confidence >= 80 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}>
            {confidence}%
          </span>
        </div>
      </div>
    </motion.button>
  );
}
