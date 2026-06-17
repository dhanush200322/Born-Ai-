import React from 'react';
import { motion } from 'framer-motion';
import { AgentBackendPayload } from '../../../lib/types/agent';
import { Globe, MessageSquare, Phone, Terminal, CheckCircle2 } from 'lucide-react';

interface Props {
  payload: AgentBackendPayload;
  updatePayload: (data: Partial<AgentBackendPayload>) => void;
}

const availableChannels = [
  { id: 'website', title: 'Website Widget', icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', activeBg: 'bg-indigo-500/20 border-indigo-500/50' },
  { id: 'whatsapp', title: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', activeBg: 'bg-emerald-500/20 border-emerald-500/50' },
  { id: 'telegram', title: 'Telegram', icon: MessageSquare, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', activeBg: 'bg-sky-500/20 border-sky-500/50' },
  { id: 'voice', title: 'Voice (Phone)', icon: Phone, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', activeBg: 'bg-rose-500/20 border-rose-500/50' },
  { id: 'api', title: 'REST API', icon: Terminal, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', activeBg: 'bg-amber-500/20 border-amber-500/50' },
];

export default function Step4Channels({ payload, updatePayload }: Props) {
  const toggleChannel = (channelId: keyof AgentBackendPayload['channels']) => {
    updatePayload({
      channels: {
        ...payload.channels,
        [channelId]: !payload.channels[channelId]
      }
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
        <h2 className="text-2xl font-bold text-white mb-2">Deploy Channels</h2>
        <p className="text-slate-400">Select where your AI agent will be available to interact with users.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableChannels.map((channel) => {
          const isActive = payload.channels[channel.id as keyof AgentBackendPayload['channels']];
          return (
            <div
              key={channel.id}
              onClick={() => toggleChannel(channel.id as keyof AgentBackendPayload['channels'])}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${
                isActive ? channel.activeBg : 'bg-slate-900 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${channel.bg} ${channel.color}`}>
                  <channel.icon className="w-6 h-6" />
                </div>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className={`w-5 h-5 ${channel.color}`} />
                  </motion.div>
                )}
              </div>
              <h3 className={`font-semibold mb-1 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                {channel.title}
              </h3>
              
              <div className="mt-4 pt-4 border-t border-black/20">
                {isActive ? (
                  <span className="text-xs font-medium text-slate-300">Requires connection setup after deploy</span>
                ) : (
                  <span className="text-xs font-medium text-slate-500">Click to enable</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
