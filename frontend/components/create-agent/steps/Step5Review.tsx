import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { AgentBackendPayload } from '../../../lib/types/agent';
import { Rocket, Sparkles, CheckCircle2, Circle, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  payload: AgentBackendPayload;
  isDeploying: boolean;
  onDeploy: () => void;
}

const DEPLOY_STEPS = [
  'Creating Agent',
  'Uploading Documents',
  'Processing Knowledge Base',
  'Generating Embeddings',
  'Deploying Agent',
  'Active'
];

export default function Step5Review({ payload, isDeploying: parentIsDeploying, onDeploy }: Props) {
  const router = useRouter();
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [deployedId, setDeployedId] = useState('');

  const activeChannels = Object.entries(payload.channels).filter(([_, active]) => active).map(([name]) => name);

  // Transition through steps using a simulated timer while request is pending
  useEffect(() => {
    if (!isDeploying) return;

    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < DEPLOY_STEPS.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isDeploying]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setCurrentStepIdx(0);
    setErrorMsg('');

    try {
      const { supabase } = await import('../../../src/supabaseClient');
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data.session?.access_token;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/agents/deploy`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          agent_details: {
            name: payload.agent_details.name,
            description: payload.agent_details.description,
            role: payload.agent_details.role,
            avatar: payload.agent_details.avatar
          },
          knowledge_base: {
            files: payload.knowledge_base.files,
            website_urls: payload.knowledge_base.website_urls,
            faqs: payload.knowledge_base.faqs
          },
          memory_config: {
            session_memory_enabled: payload.memory_config.session_memory_enabled,
            long_term_memory_enabled: payload.memory_config.long_term_memory_enabled,
            retention_period_days: payload.memory_config.retention_period_days
          },
          channels: payload.channels
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Step complete! Set index to "Active"
        setCurrentStepIdx(DEPLOY_STEPS.length - 1);
        setDeployedId(result.agent_id);
        
        // Wait 1.5 seconds on active screen, then redirect to Playground
        setTimeout(() => {
          router.push(`/agents/${result.agent_id}`);
        }, 1500);
      } else {
        throw new Error(result.detail || 'Failed to deploy agent');
      }
    } catch (err: any) {
      console.error('Deployment error:', err.message || err);
      setErrorMsg(err.message === 'Failed to fetch' ? 'Failed to connect to backend server. Is it running?' : (err.message || 'An error occurred during deployment.'));
      setIsDeploying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Review & Deploy</h2>
        <p className="text-slate-400">Review your agent configuration before finalizing the deployment.</p>
      </div>

      <AnimatePresence mode="wait">
        {isDeploying ? (
          <motion.div 
            key="deploying-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6"
          >
            <div className="text-center py-4">
              <Sparkles className="w-10 h-10 text-purple-400 animate-pulse mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">Deploying AI Agent</h3>
              <p className="text-slate-400 text-sm">Setting up server resources and indexing vector databases...</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              {DEPLOY_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIdx;
                const isActive = index === currentStepIdx;
                
                return (
                  <div key={step} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-slate-300 line-through decoration-slate-600' : 
                      isActive ? 'text-white font-semibold' : 'text-slate-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="review-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Basic Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Agent Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500 block mb-1">Name</span>
                    <span className="text-white font-medium">{payload.agent_details.name || 'Unnamed Agent'}</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500 block mb-1">Category</span>
                    <span className="text-white font-medium">{payload.agent_details.role || 'Unspecified'}</span>
                  </div>
                </div>
              </div>

              {/* Knowledge & Memory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Knowledge</h3>
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 h-full">
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {payload.knowledge_base.website_urls.length} URLs Crawled</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {payload.knowledge_base.files.length} Files Uploaded</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {payload.knowledge_base.faqs.length} FAQ Q&As Added</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Memory</h3>
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 h-full">
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${payload.memory_config.session_memory_enabled ? 'text-emerald-400' : 'text-slate-600'}`} /> Session Memory</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${payload.memory_config.long_term_memory_enabled ? 'text-emerald-400' : 'text-slate-600'}`} /> Long-Term Memory ({payload.memory_config.retention_period_days} days)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Channels */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Deployment Channels</h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-wrap gap-2">
                  {activeChannels.length > 0 ? (
                    activeChannels.map(c => (
                      <span key={c} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white capitalize">{c}</span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm italic">No channels selected</span>
                  )}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            <button 
              onClick={handleDeploy}
              disabled={!payload.agent_details.name}
              className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group rounded-xl font-medium text-lg flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              Deploy Agent
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

