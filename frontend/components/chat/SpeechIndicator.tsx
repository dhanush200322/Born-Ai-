import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Check } from 'lucide-react';

interface Props {
  isListening: boolean;
  justFinished: boolean; // True for 2 seconds after speech completes
}

export const SpeechIndicator: React.FC<Props> = ({ isListening, justFinished }) => {
  return (
    <AnimatePresence>
      {(isListening || justFinished) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-10 left-4 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 shadow-lg flex items-center gap-2 text-xs font-semibold"
        >
          {isListening ? (
            <>
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </div>
              <span className="text-purple-300">Listening...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Speech captured</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
