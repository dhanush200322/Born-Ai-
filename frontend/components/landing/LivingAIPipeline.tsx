import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Link, FileCode, Cpu, Database, Brain, Bot, Globe, MessageCircle, Code2, CheckCircle2, Activity, Loader2 } from 'lucide-react';

const IngestionNodes = [
  { icon: FileText, label: "PDF/DOCX", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Link, label: "Website", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: FileCode, label: "API/JSON", color: "text-amber-400", bg: "bg-amber-500/10" },
];

const DeploymentNodes = [
  { icon: Globe, label: "Web", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: MessageCircle, label: "WhatsApp", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Code2, label: "API", color: "text-rose-400", bg: "bg-rose-500/10" },
];

// Matches the exact requested flow text
const liveStatuses = [
  "Retrieving context...",
  "Searching memory...",
  "Generating response...",
  "Deploying agent..."
];

export default function LivingAIPipeline() {
  const [activeStatus, setActiveStatus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatus(prev => (prev + 1) % liveStatuses.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center p-8">
      {/* Background Grid & Blur */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-[100px] rounded-full pointer-events-none" />

      {/* SVG Connecting Lines (Pulsing) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <motion.path 
          d="M 120 300 Q 250 300 350 240 T 500 300 T 650 300"
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 120 150 Q 250 200 350 240"
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 120 450 Q 250 400 350 360 T 500 300"
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 500 300 Q 600 250 680 150"
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 500 300 Q 600 350 680 450"
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Main Pipeline Container */}
      <div className="relative w-full max-w-4xl flex items-center justify-between z-10 gap-4">
        
        {/* Stage 1: Ingestion */}
        <div className="flex flex-col gap-6">
          {IngestionNodes.map((node, i) => (
            <motion.div 
              key={i}
              className="relative group"
            >
              <motion.div 
                animate={{ borderColor: activeStatus === 0 ? "rgba(96, 165, 250, 0.8)" : "rgba(255, 255, 255, 0.1)" }}
                className={`w-12 h-12 rounded-xl border ${node.bg} backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-colors`}
              >
                <node.icon className={`w-5 h-5 ${node.color} ${activeStatus === 0 ? 'animate-pulse' : ''}`} />
              </motion.div>
              
              {/* Continuous Data Packet */}
              <motion.div 
                animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                className="absolute top-1/2 -right-24 w-3 h-1.5 rounded-full bg-blue-400 blur-[2px] shadow-[0_0_8px_#60a5fa]"
              />
            </motion.div>
          ))}
        </div>

        {/* Stage 2 & 3: Processing & DB */}
        <div className="flex flex-col gap-12 items-center relative">
          {/* PROCESSING NODE */}
          <motion.div 
            animate={{ 
              boxShadow: activeStatus === 0 ? ["0 0 15px rgba(168,85,247,0.4)", "0 0 40px rgba(168,85,247,0.8)", "0 0 15px rgba(168,85,247,0.4)"] : "0 0 10px rgba(168,85,247,0.1)",
              borderColor: activeStatus === 0 ? "rgba(168,85,247,0.8)" : "rgba(168,85,247,0.3)"
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-purple-500/10 border flex items-center justify-center backdrop-blur-md relative"
          >
            <Cpu className="w-8 h-8 text-purple-400" />
            <div className="absolute -top-6 whitespace-nowrap text-[10px] text-purple-300/70 font-mono tracking-wider">PROCESSING</div>
            
            {/* Packet to DB */}
            <motion.div 
              animate={{ y: [0, 60], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-16 w-1.5 h-3 rounded-full bg-purple-400 blur-[1px]"
            />
          </motion.div>

          {/* VECTOR DB NODE */}
          <motion.div 
            animate={{ 
              boxShadow: activeStatus === 0 ? ["0 0 15px rgba(99,102,241,0.4)", "0 0 40px rgba(99,102,241,0.8)", "0 0 15px rgba(99,102,241,0.4)"] : "0 0 10px rgba(99,102,241,0.1)",
              borderColor: activeStatus === 0 ? "rgba(99,102,241,0.8)" : "rgba(99,102,241,0.3)"
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-indigo-500/10 border flex items-center justify-center backdrop-blur-md relative"
          >
            <Database className="w-8 h-8 text-indigo-400" />
            <div className="absolute -bottom-6 whitespace-nowrap text-[10px] text-indigo-300/70 font-mono tracking-wider">VECTOR DB</div>
          </motion.div>

          {/* Packet to Agent */}
          <motion.div 
            animate={{ x: [0, 80], y: [-30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-20 w-3 h-1.5 rounded-full bg-indigo-400 blur-[2px]"
          />
        </div>

        {/* Stage 4: Memory Core */}
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            animate={{ 
              scale: activeStatus === 1 ? [1, 1.1, 1] : 1,
              borderColor: activeStatus === 1 ? "rgba(16, 185, 129, 0.8)" : "rgba(16, 185, 129, 0.3)",
              boxShadow: activeStatus === 1 ? "0 0 30px rgba(16,185,129,0.5)" : "0 0 0px rgba(0,0,0,0)"
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-emerald-500/10 border flex items-center justify-center backdrop-blur-md relative"
          >
            <Brain className="w-8 h-8 text-emerald-400" />
            <div className="absolute -top-6 whitespace-nowrap text-[10px] text-emerald-300/70 font-mono tracking-wider">MEMORY</div>
          </motion.div>
          {/* Packet to Agent */}
          <motion.div 
            animate={{ x: [0, 80], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
            className="absolute z-0 w-3 h-1.5 rounded-full bg-emerald-400 blur-[2px] right-[40%]"
          />
        </div>

        {/* Stage 5: Agent Core */}
        <div className="relative">
          {/* Live Status Overlay */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 border border-white/10 px-4 py-2 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-sm text-white font-mono w-[180px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeStatus}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {liveStatuses[activeStatus]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <motion.div 
            animate={{ 
              boxShadow: activeStatus === 2 ? ["0 0 30px rgba(99,102,241,0.5)", "0 0 80px rgba(99,102,241,0.8)", "0 0 30px rgba(99,102,241,0.5)"] : "0 0 20px rgba(99,102,241,0.2)",
              borderColor: activeStatus === 2 ? "rgba(99,102,241,0.8)" : "rgba(99,102,241,0.3)"
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 flex items-center justify-center backdrop-blur-xl relative z-10"
          >
            <Bot className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-slate-950" />
            </div>
          </motion.div>

          {/* Packets to Deployment */}
          <motion.div 
            animate={{ x: [0, 80], y: [0, -60], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="absolute top-1/2 -right-20 w-3 h-1.5 rounded-full bg-rose-400 blur-[2px]"
          />
          <motion.div 
            animate={{ x: [0, 80], y: [0, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/2 -right-20 w-3 h-1.5 rounded-full bg-indigo-400 blur-[2px]"
          />
          <motion.div 
            animate={{ x: [0, 80], y: [0, 60], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
            className="absolute top-1/2 -right-20 w-3 h-1.5 rounded-full bg-green-400 blur-[2px]"
          />
        </div>

        {/* Stage 6: Deployment */}
        <div className="flex flex-col gap-6">
          {DeploymentNodes.map((node, i) => (
            <motion.div 
              key={i}
              className="relative flex items-center gap-3"
            >
              <motion.div 
                animate={{ borderColor: activeStatus === 3 ? "rgba(16, 185, 129, 0.8)" : "rgba(255, 255, 255, 0.1)" }}
                className={`w-12 h-12 rounded-xl border ${node.bg} backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-colors`}
              >
                <node.icon className={`w-5 h-5 ${node.color}`} />
              </motion.div>

              {/* Animated Deployment Status */}
              <AnimatePresence mode="wait">
                {activeStatus === 3 ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Deploying</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Standby</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
