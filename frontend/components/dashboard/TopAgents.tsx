import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Power, MoreHorizontal, Settings, Globe, MessageSquare, ShieldAlert, Database, Sparkles, User, Briefcase, Smile, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
}

const AvatarIconMap: Record<string, React.ElementType> = {
  Bot, Sparkles, User, Briefcase, Smile, Zap
};

export default function TopAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { supabase } = await import('../../src/supabaseClient');
        const sessionRes = await supabase.auth.getSession();
        const token = sessionRes.data.session?.access_token;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_BASE_URL}/api/agents/`, { headers });
        if (!res.ok) {
          console.warn(`Backend returned status ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data.success && data.agents) {
          setAgents(data.agents);
        }
      } catch (err) {
        console.warn('Failed to fetch agents (backend might be starting up):', err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">My Agents</h2>
          <p className="text-sm text-slate-400">Manage and chat with your active AI workforce.</p>
        </div>
        <Link href="/dashboard/create-agent">
          <Button className="bg-white text-slate-950 hover:bg-slate-200">
            Create New Agent
          </Button>
        </Link>
      </div>
      
      <div className="divide-y divide-white/5">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No agents found. Create one to get started!</div>
        ) : (
          agents.map((agent, i) => {
            const SelectedAvatar = AvatarIconMap[agent.avatar] || Bot;
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                key={agent.id} 
                className="group relative"
              >
                <Link href={`/agents/${agent.id}`} className="block p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {agent.avatar && !AvatarIconMap[agent.avatar] ? (
                        <img src={agent.avatar.startsWith('http') ? agent.avatar : `http://localhost:8000/api/agents/files/${agent.avatar.split(/[\\\\/]/).pop()}`} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <SelectedAvatar className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors">{agent.name}</h3>
                        {agent.status === 'ACTIVE' || agent.status === 'active' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 uppercase tracking-wider border border-emerald-500/20">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 uppercase tracking-wider border border-white/10">Draft</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{agent.role}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8">
                    <div className="flex flex-col items-end w-24">
                      <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Knowledge</span>
                      <span className="text-sm text-emerald-400 flex items-center gap-1"><Database className="w-3 h-3" /> Synced</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                      <button className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                        <Power className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
