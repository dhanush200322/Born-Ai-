import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { VoiceButton } from './VoiceButton';
import { VoiceWave } from './VoiceWave';
import { SpeechIndicator } from './SpeechIndicator';

interface Props {
  inputMessage: string;
  setInputMessage: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSending: boolean;
}

export const ChatInput: React.FC<Props> = ({ inputMessage, setInputMessage, onSubmit, isSending }) => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    permissionError,
    supported
  } = useSpeechRecognition();

  const [justFinished, setJustFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+Shift+M
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, startListening, stopListening]);

  // Handle transcript updates
  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript, setInputMessage]);

  // Handle completion state for SpeechIndicator
  useEffect(() => {
    if (!isListening && transcript) {
      setJustFinished(true);
      const timer = setTimeout(() => setJustFinished(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      {/* Permission Error Toast */}
      {permissionError && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
          {permissionError}
        </div>
      )}

      {/* Speech Indicator Badge */}
      <SpeechIndicator isListening={isListening} justFinished={justFinished} />

      <form onSubmit={onSubmit} className="p-4 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-2xl p-1.5 pl-4 focus-within:ring-2 focus-within:ring-purple-500/30 transition-all">
          
          <input 
            ref={inputRef}
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask your AI anything..."}
            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm py-2"
            disabled={isSending}
            aria-label="Chat input"
          />

          <div className="flex items-center gap-1">
            {isListening && <VoiceWave />}
            
            {supported && (
              <VoiceButton 
                isListening={isListening} 
                onClick={toggleVoice} 
                disabled={isSending} 
              />
            )}

            <button 
              type="submit" 
              disabled={!inputMessage.trim() || isSending || isListening}
              className="p-3 md:w-12 md:h-12 bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-white rounded-xl transition-all flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
