import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText, BrainCircuit, Network, Rocket } from 'lucide-react';
import { Button } from '../ui/button';

export default function OnboardingState() {
  const steps = [
    { title: 'Agent Details', desc: 'Define role and prompt', icon: Bot },
    { title: 'Knowledge Base', desc: 'Upload PDF, DOCX, URL', icon: FileText },
    { title: 'Memory System', desc: 'Enable long-term recall', icon: BrainCircuit },
    { title: 'Channels', desc: 'Connect WhatsApp or Web', icon: Network },
    { title: 'Deploy', go: true, desc: 'Go live instantly', icon: Rocket }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)] mb-8"
      >
        <Bot className="w-10 h-10 text-indigo-400" />
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-white mb-4"
      >
        Welcome to Born AI OS
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 max-w-lg mb-12 text-lg"
      >
        Your workspace is ready. Follow the 5-step deployment flow to create your first intelligent agent.
      </motion.p>

      {/* Visual Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-0 w-full max-w-4xl mb-12 relative"
      >
        <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-white/10 z-0"></div>

        {steps.map((step, i) => (
          <div key={step.title} className="flex-1 flex flex-col items-center relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.go ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border border-white/10 text-slate-400'}`}>
              <step.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
            <p className="text-xs text-slate-500 text-center max-w-[120px]">{step.desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button size="lg" className="h-14 px-10 text-lg bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.15)] group">
          Create Your First Agent
          <Rocket className="w-5 h-5 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
}
