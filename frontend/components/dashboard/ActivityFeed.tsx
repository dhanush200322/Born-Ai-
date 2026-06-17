import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, UploadCloud, PlusCircle, AlertCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  agent: string;
  description: string;
  time: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  message: {
    icon: MessageSquare,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20'
  },
  upload: {
    icon: UploadCloud,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  create: {
    icon: PlusCircle,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20'
  },
  alert: {
    icon: AlertCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20'
  }
};

function formatTimeAgo(isoString: string): string {
  try {
    const eventTime = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - eventTime.getTime();
    
    // Check if time difference is negative (e.g. clock mismatch)
    if (diffMs < 0) return 'Just now';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch (err) {
    return 'Recently';
  }
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
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
        const res = await fetch(`${API_BASE_URL}/api/agents/dashboard/activities`, { headers });
        if (!res.ok) {
          console.warn(`Backend returned status ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data.success && data.activities) {
          setActivities(data.activities);
        }
      } catch (err) {
        console.warn('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        <p className="text-sm text-slate-400">Live operational events across your workspace.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 space-y-8 min-h-[150px]">
        {loading ? (
          <div className="p-4 text-slate-500 text-sm text-center">Loading activity feed...</div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-slate-500 text-sm text-center">No recent activities. Actions will appear here.</div>
        ) : (
          activities.map((activity, i) => {
            const config = typeConfig[activity.type] || typeConfig.create;
            const ActivityIcon = config.icon;
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                key={activity.id} 
                className="relative pl-6"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border bg-slate-900 ${config.bg}`}>
                  <ActivityIcon className={`w-3 h-3 ${config.color}`} />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-slate-300 leading-snug">
                    <span className="font-semibold text-white">{activity.agent}</span> {activity.description}
                  </p>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatTimeAgo(activity.time)}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
