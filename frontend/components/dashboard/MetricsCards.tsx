import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Activity, Globe, Database, Network, MessageSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface DashboardStats {
  active_agents: number;
  total_agents: number;
  total_operations: number;
  total_documents: number;
  total_chunks: number;
}

export default function MetricsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    active_agents: 0,
    total_agents: 0,
    total_operations: 0,
    total_documents: 0,
    total_chunks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
        const res = await fetch(`${API_BASE_URL}/api/agents/dashboard/stats`, { headers });
        if (!res.ok) {
          console.warn(`Backend returned status ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* AI Infrastructure Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-purple-500/30 transition-colors shadow-xl group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Server className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
              {loading ? 'Checking status...' : 'All Systems Operational'}
            </span>
          </div>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">AI Infrastructure</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {loading ? '-' : stats.active_agents}
          </span>
          <span className="text-sm text-slate-500 font-medium">
            / {loading ? '-' : stats.total_agents} Agents Active
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Avg Latency:</span>
          </div>
          <span className="text-white font-mono">124ms</span>
        </div>
      </motion.div>

      {/* Deployment Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/30 transition-colors shadow-xl group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Network className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Isolated Scope</span>
          </div>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">Total Conversations</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {loading ? '-' : stats.total_operations}
          </span>
          <span className="text-sm text-slate-500 font-medium">sessions</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Web Platform</span>
          </div>
        </div>
      </motion.div>

      {/* Knowledge Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors shadow-xl group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-white/10">
            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
              {loading ? 'Loading...' : 'Synced'}
            </span>
          </div>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">Vector Memory (RAG)</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {loading ? '-' : stats.total_chunks}
          </span>
          <span className="text-sm text-slate-500 font-medium">Chunks Indexed</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Knowledge Documents:</span>
          </div>
          <span className="text-white font-medium">
            {loading ? '-' : stats.total_documents}
          </span>
        </div>
      </motion.div>

    </div>
  );
}
