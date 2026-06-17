import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import LivingAIPipeline from './LivingAIPipeline';

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  // Cinematic scroll animation hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // On scroll down: fade out, scale down, tilt back (rotateX), and push down (y)
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.8]);
  const rotateX = useTransform(smoothProgress, [0, 1], [0, 15]);
  const y = useTransform(smoothProgress, [0, 1], [0, 150]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100vh] pt-32 pb-20 flex items-center justify-center border-b border-white/5 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <motion.div 
        style={shouldReduceMotion ? {} : { opacity, scale, rotateX, y, transformStyle: 'preserve-3d' }}
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full relative z-10"
      >
        {/* Left: Cinematic Typography */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20, translateZ: -50 }}
            animate={{ opacity: 1, y: 0, translateZ: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">Enterprise AI OS v2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20, translateZ: 100 }}
            animate={{ opacity: 1, y: 0, translateZ: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI Agents</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg lg:text-xl text-slate-300 max-w-xl font-light"
          >
            Create, deploy, and scale intelligent agents powered by your company's knowledge. Grounded in RAG, enhanced with long-term memory.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="relative group overflow-hidden bg-white text-slate-950 hover:text-white hover:bg-transparent h-14 px-8 text-base transition-all duration-300 border border-transparent hover:border-white/50">
                <span className="relative z-10 font-semibold">Deploy Your First Agent</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-14 px-8 text-base bg-transparent backdrop-blur-sm group">
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-purple-400" />
              Watch Platform Tour
            </Button>
          </motion.div>
        </div>

        {/* Right: Unified Living AI Pipeline */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: 15, translateZ: -100 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, translateZ: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="relative w-full lg:scale-125 lg:translate-x-12"
        >
          <LivingAIPipeline />
        </motion.div>
      </motion.div>
    </section>
  );
}
