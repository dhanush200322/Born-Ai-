import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Lock, Server, Zap } from 'lucide-react';

const metrics = [
  { value: 50, suffix: 'K+', label: 'Agents Created' },
  { value: 10, suffix: 'M+', label: 'Messages Processed' },
  { value: 500, suffix: 'K+', label: 'Knowledge Documents' },
  { value: 99.99, suffix: '%', label: 'Uptime SLA' }
];

const capabilities = [
  { icon: Shield, text: 'SOC2 Type II Certified' },
  { icon: Lock, text: 'End-to-End Encryption' },
  { icon: Server, text: 'Dedicated Infrastructure' },
  { icon: Zap, text: 'Sub-second Latency' }
];

export default function TrustSection() {
  return (
    <section className="py-24 relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {metrics.map((metric, i) => (
            <Counter key={i} value={metric.value} suffix={metric.suffix} label={metric.label} delay={i * 0.1} />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-12 border-t border-white/5">
          {capabilities.map((cap, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-400">
              <cap.icon className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium">{cap.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix, label, delay }: { value: number, suffix: string, label: string, delay: number }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Number((easeProgress * end).toFixed(value % 1 !== 0 ? 2 : 0)));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
