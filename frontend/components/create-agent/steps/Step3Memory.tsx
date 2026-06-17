import React from 'react';
import { motion } from 'framer-motion';
import { AgentBackendPayload } from '../../../lib/types/agent';
import { BrainCircuit, Clock, HardDrive } from 'lucide-react';

interface Props {
  payload: AgentBackendPayload;
  updatePayload: (data: Partial<AgentBackendPayload>) => void;
}

export default function Step3Memory({ payload, updatePayload }: Props) {
  const { session_memory_enabled, long_term_memory_enabled, retention_period_days } = payload.memory_config;

  const handleToggle = (field: 'session_memory_enabled' | 'long_term_memory_enabled') => {
    updatePayload({
      memory_config: { ...payload.memory_config, [field]: !payload.memory_config[field] }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Memory System</h2>
        <p className="text-slate-400">Configure how your agent recalls past interactions.</p>
      </div>

      <div className="space-y-4">
        {/* Session Memory */}
        <div 
          onClick={() => handleToggle('session_memory_enabled')}
          className={`p-6 rounded-2xl border cursor-pointer transition-all ${
            session_memory_enabled ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${session_memory_enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400'}`}>
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-semibold ${session_memory_enabled ? 'text-indigo-300' : 'text-white'}`}>Session Memory</h3>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${session_memory_enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                  <motion.div 
                    layout 
                    className="w-4 h-4 rounded-full bg-white absolute top-1"
                    initial={false}
                    animate={{ left: session_memory_enabled ? '20px' : '4px' }}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-400">Maintains context only within the current active conversation. Flushed when the session ends.</p>
            </div>
          </div>
        </div>

        {/* Long Term Memory */}
        <div 
          onClick={() => handleToggle('long_term_memory_enabled')}
          className={`p-6 rounded-2xl border cursor-pointer transition-all ${
            long_term_memory_enabled ? 'bg-purple-500/10 border-purple-500/50' : 'bg-slate-900 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${long_term_memory_enabled ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-400'}`}>
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-semibold ${long_term_memory_enabled ? 'text-purple-300' : 'text-white'}`}>Long-Term Memory</h3>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${long_term_memory_enabled ? 'bg-purple-500' : 'bg-slate-700'}`}>
                  <motion.div 
                    layout 
                    className="w-4 h-4 rounded-full bg-white absolute top-1"
                    initial={false}
                    animate={{ left: long_term_memory_enabled ? '20px' : '4px' }}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">Remembers user preferences and past conversations indefinitely across multiple sessions.</p>
              
              {long_term_memory_enabled && (
                <div className="flex items-center gap-2 p-3 bg-black/20 rounded-lg border border-black/20" onClick={e => e.stopPropagation()}>
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-300 flex-1">Estimated vector storage impact: <span className="font-semibold text-white">~5MB / 1000 users</span></span>
                  <select 
                    value={retention_period_days}
                    onChange={(e) => updatePayload({ memory_config: { ...payload.memory_config, retention_period_days: e.target.value === 'infinite' ? 'infinite' : parseInt(e.target.value) }})}
                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                    <option value="infinite">Infinite</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
