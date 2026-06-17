import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Database, Globe, Activity, Terminal } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-32 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Mission Control for AI</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Monitor, debug, and scale your autonomous agents from a single pane of glass.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Production Cluster</h3>
                <p className="text-sm text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  All Systems Operational
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300">Region: US-East</div>
              <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300">Plan: Enterprise</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard icon={Users} title="Active Agents" value="24" trend="+3 this week" />
            <MetricCard icon={MessageSquare} title="Messages Today" value="142.5K" trend="+12% vs yesterday" />
            <MetricCard icon={Database} title="Knowledge Bases" value="8" trend="1.2TB Indexed" />
            <MetricCard icon={Globe} title="Active Endpoints" value="15" trend="99.99% Uptime" />
          </div>

          {/* Live Activity Stream */}
          <div className="bg-black/40 rounded-xl border border-white/5 p-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Live Deployment Stream
            </h4>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <LogLine time="10:42:01" msg="[CustomerSupport] Responded to ticket #4928" type="success" />
              <LogLine time="10:41:55" msg="[SalesBot] Booked demo with Enterprise Client" type="info" />
              <LogLine time="10:41:12" msg="[HR_Agent] Updated internal policy vector store" type="success" />
              <LogLine time="10:40:05" msg="[System] Auto-scaling cluster nodes..." type="warning" />
              <LogLine time="10:39:42" msg="[CustomerSupport] Extracted context from Long-Term Memory" type="info" />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, title, value, trend }: any) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-medium text-slate-400">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500">{trend}</div>
    </div>
  );
}

function LogLine({ time, msg, type }: any) {
  const colors = {
    success: 'text-green-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400'
  };
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex gap-4 p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
    >
      <span className="text-slate-500">{time}</span>
      <span className={(colors as any)[type]}>{msg}</span>
    </motion.div>
  );
}
