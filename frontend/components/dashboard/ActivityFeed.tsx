import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, UploadCloud, PlusCircle, AlertCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'message',
    agent: 'SalesOS Agent',
    description: 'processed a lead qualification via WhatsApp',
    time: '2 mins ago',
    icon: MessageSquare,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20'
  },
  {
    id: 2,
    type: 'upload',
    agent: 'Knowledge Base',
    description: 'successfully indexed "Q3_Financial_Report.pdf" (14.2MB)',
    time: '15 mins ago',
    icon: UploadCloud,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 3,
    type: 'create',
    agent: 'System',
    description: 'New agent "Support Bot V2" was deployed to staging',
    time: '1 hour ago',
    icon: PlusCircle,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 4,
    type: 'alert',
    agent: 'HR Assistant',
    description: 'encountered an API rate limit error from Slack',
    time: '3 hours ago',
    icon: AlertCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20'
  }
];

export default function ActivityFeed() {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        <p className="text-sm text-slate-400">Live operational events across your workspace.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 space-y-8">
        {activities.map((activity, i) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            key={activity.id} 
            className="relative pl-6"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border bg-slate-900 ${activity.bg}`}>
              <activity.icon className={`w-3 h-3 ${activity.color}`} />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-slate-300 leading-snug">
                <span className="font-semibold text-white">{activity.agent}</span> {activity.description}
              </p>
              <span className="text-xs text-slate-500 font-medium">{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
