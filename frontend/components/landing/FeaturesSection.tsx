import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Brain, BarChart3, Globe, MessageCircle, Code, Workflow, Zap } from 'lucide-react';

const largeFeatures = [
  { icon: Cpu, title: 'AI Agent Builder', desc: 'Visually create, test, and tune AI agents with specialized roles in a no-code canvas.' },
  { icon: Database, title: 'Knowledge Base (RAG)', desc: 'Upload PDF, DOCX, TXT or crawl websites. Our advanced RAG engine vectorizes data instantly.' },
  { icon: Brain, title: 'Long-Term Memory', desc: 'Agents maintain context across sessions, remembering user preferences and conversation history.' }
];

const secondaryFeatures = [
  { icon: Globe, title: 'Web Deploy', desc: 'Embed anywhere.' },
  { icon: MessageCircle, title: 'WhatsApp', desc: 'Direct business API.' },
  { icon: Code, title: 'REST API', desc: 'Headless access.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time metrics.' },
  { icon: Workflow, title: 'Actions', desc: 'Trigger workflows.' }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">Enterprise Capabilities</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">The complete platform for<br/><span className="text-slate-500">autonomous agents</span></h2>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {largeFeatures.map((f, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              key={f.title} 
              className="col-span-1 relative group overflow-hidden p-8 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-white/20 transition-all duration-500"
            >
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                  <f.icon className="w-7 h-7 text-indigo-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}

          {/* Secondary Cards Wrapper */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-6 mt-2">
            {secondaryFeatures.map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (i * 0.05), duration: 0.5 }}
                key={f.title} 
                className="p-6 rounded-2xl bg-slate-900/20 border border-white/5 hover:bg-slate-800/40 hover:border-white/10 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <f.icon className="w-6 h-6 text-slate-500 group-hover:text-purple-400 mb-4 transition-colors" />
                <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
