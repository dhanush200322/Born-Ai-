import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Search, Brain, Layers, Rocket } from 'lucide-react';

const pipelineSteps = [
  { icon: Upload, title: 'Knowledge Upload', desc: 'Ingest PDF, DOCX, CSV, or crawl URLs.' },
  { icon: Cpu, title: 'Document Processing', desc: 'Chunking, cleaning, and embedding generation.' },
  { icon: Search, title: 'Vector Search', desc: 'Fast similarity search via advanced vector DB.' },
  { icon: Brain, title: 'Memory Engine', desc: 'Maintain session context and user preference.' },
  { icon: Layers, title: 'Reasoning', desc: 'LLM synthesizes context into exact answers.' },
  { icon: Rocket, title: 'Deployment', desc: 'Stream output to Web, WhatsApp, or API.' }
];

export default function ProductShowcase() {
  return (
    <section className="py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">The Autonomous Pipeline</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Under the hood, every interaction flows through our enterprise-grade reasoning engine.</p>
        </div>

        <div className="relative">
          {/* Animated Connection Line */}
          <div className="absolute left-[23px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5 z-0">
            <motion.div 
              className="w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          <div className="flex flex-col gap-12 relative z-10">
            {pipelineSteps.map((step, i) => (
              <PipelineStep 
                key={i} 
                step={step} 
                index={i} 
                isLeft={i % 2 === 0} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineStep({ step, index, isLeft }: { step: any, index: number, isLeft: boolean }) {
  return (
    <div className={`flex items-center w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-start relative`}>
      {/* Connector dot for mobile/desktop */}
      <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 z-20" />
      
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`w-[calc(100%-3rem)] md:w-[45%] ${isLeft ? 'ml-12 md:ml-0 md:mr-12' : 'ml-12 md:ml-12'}`}
      >
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-sm hover:bg-slate-800/60 transition-colors group">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <step.icon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{step.title}</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed ml-14">{step.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}
