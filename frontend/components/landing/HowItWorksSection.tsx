import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Upload, Bot, Brain, Rocket } from 'lucide-react';

const steps = [
  { 
    id: '01', title: 'Upload Knowledge', icon: Upload, 
    desc: 'Connect your data sources instantly. We support PDF, DOCX, CSV, and direct website crawling. Our engine vectorizes your data in seconds.' 
  },
  { 
    id: '02', title: 'Create Agent', icon: Bot, 
    desc: 'Use our no-code canvas to define your agent\'s role, tone of voice, and specific instructions. Give it a unique personality.' 
  },
  { 
    id: '03', title: 'Enable Memory', icon: Brain, 
    desc: 'Toggle Long-Term Memory on. Your agent will now track user preferences and recall past conversations to provide hyper-personalized responses.' 
  },
  { 
    id: '04', title: 'Deploy Anywhere', icon: Rocket, 
    desc: 'Embed the agent on your website, connect it to your WhatsApp Business number, or access it headless via our REST API.' 
  }
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Built for Speed</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Go from raw documents to a production-ready agent in under 5 minutes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
          
          {/* Left: Sticky Visuals */}
          <div className="hidden lg:block">
            <div className="sticky top-1/3 w-full aspect-square bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-md p-8 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]">
              {/* Dynamic visual driven by scroll */}
              <motion.div 
                style={{ 
                  scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.2]),
                  rotate: useTransform(scrollYProgress, [0, 1], [0, 90])
                }}
                className="w-48 h-48 rounded-full border-[1px] border-dashed border-indigo-500/50 flex items-center justify-center relative"
              >
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl" />
                <motion.div 
                   style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [1, 0, 1, 0, 1]) }}
                >
                  <Bot className="w-16 h-16 text-indigo-400" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right: Scrolling Steps */}
          <div className="flex flex-col gap-32 py-16">
            {steps.map((step, i) => (
              <div key={step.id} className="relative group">
                <div className="text-indigo-500/20 font-bold text-6xl absolute -top-8 -left-6 select-none group-hover:text-indigo-500/40 transition-colors">
                  {step.id}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-lg text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
