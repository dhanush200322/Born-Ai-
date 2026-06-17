import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface Props {
  isListening: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const VoiceButton: React.FC<Props> = ({ isListening, onClick, disabled }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background glowing ring when listening */}
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-500/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      <motion.button
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-colors ${
          isListening
            ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
            : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isListening ? "Stop recording" : "Start recording (Ctrl+Shift+M)"}
        aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
      >
        {isListening ? (
          <div className="w-3 h-3 rounded-full bg-white" /> // Red recording dot logic (button is already red)
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
};
