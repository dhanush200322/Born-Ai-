import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileCode, Globe, FileType, Bot, CheckCircle2, MessageSquare, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function CinematicHeroSequence() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 7 phases, each lasts 2.8 seconds (19.6s total loop)
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 7);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center pointer-events-none perspective-[1000px]">
      <AnimatePresence mode="popLayout">
        
        {/* SCENE 1: KNOWLEDGE INGESTION */}
        {phase === 0 && (
          <motion.div key="scene1" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Core Outline */}
              <div className="absolute w-24 h-24 rounded-full border border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]" />
              {/* Flowing Documents */}
              <DocIcon Icon={FileText} label="PDF" startPos={{ x: -150, y: -150 }} delay={0} />
              <DocIcon Icon={FileCode} label="DOCX" startPos={{ x: 150, y: -100 }} delay={0.2} />
              <DocIcon Icon={FileType} label="TXT" startPos={{ x: -100, y: 150 }} delay={0.4} />
              <DocIcon Icon={Globe} label="URL" startPos={{ x: 150, y: 150 }} delay={0.6} />
            </div>
          </motion.div>
        )}

        {/* SCENE 2: KNOWLEDGE PROCESSING */}
        {phase === 1 && (
          <motion.div key="scene2" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.5 } }}
          >
            <div className="relative w-full h-full">
              {[...Array(40)].map((_, i) => {
                const angle = (i / 40) * Math.PI * 2;
                const distance = 50 + Math.random() * 150;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: Math.cos(angle) * distance, 
                      y: Math.sin(angle) * distance,
                      opacity: [0, 1, 0.5, 1]
                    }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                  />
                );
              })}
              {/* Network connecting lines simulated via background radial lines */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.15)_0%,_transparent_60%)] animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* SCENE 3: MEMORY ACTIVATION */}
        {phase === 2 && (
          <motion.div key="scene3" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }}
          >
            <MemoryNode label="User Memory" pos={{ x: 0, y: -100 }} color="from-blue-500 to-indigo-500" delay={0} />
            <MemoryNode label="Session" pos={{ x: -90, y: 60 }} color="from-purple-500 to-pink-500" delay={0.3} />
            <MemoryNode label="Long-Term" pos={{ x: 90, y: 60 }} color="from-emerald-400 to-teal-500" delay={0.6} />
            
            {/* Energy flows */}
            <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
              <motion.path d="M 200 100 L 110 260 L 290 260 Z" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="2" strokeDasharray="10 10" 
                animate={{ strokeDashoffset: [0, 100] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </motion.svg>
          </motion.div>
        )}

        {/* SCENE 4: AGENT CREATION */}
        {phase === 3 && (
          <motion.div key="scene4" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div className="relative flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-slate-900 border border-purple-500/50 shadow-[0_0_60px_rgba(168,85,247,0.4)] flex items-center justify-center relative z-10">
                <Bot className="w-16 h-16 text-purple-400" />
                <motion.div className="absolute inset-0 rounded-full border-2 border-purple-400" animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="absolute -bottom-12 flex flex-col items-center gap-1">
                <span className="text-sm font-bold text-white tracking-wide">Customer Support Agent</span>
                <span className="text-xs font-mono text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> ONLINE</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* SCENE 5: DEPLOYMENT */}
        {phase === 4 && (
          <motion.div key="scene5" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {/* Core */}
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center z-10">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            {/* Orbit Rings */}
            <div className="absolute w-[280px] h-[280px] rounded-full border border-white/10" />
            
            {/* Orbiting Channels */}
            <OrbitChannel icon={Globe} label="Web" angle={0} />
            <OrbitChannel icon={MessageSquare} label="WhatsApp" angle={120} />
            <OrbitChannel icon={Cpu} label="API" angle={240} />
            
            {/* Light beams */}
            <motion.div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent top-1/2 left-0 -translate-y-1/2" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
          </motion.div>
        )}

        {/* SCENE 6: LIVE ACTIVITY */}
        {phase === 5 && (
          <motion.div key="scene6" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(20px)", scale: 2, transition: { duration: 0.5 } }}
          >
             <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center z-10">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <div className="absolute w-[280px] h-[280px] rounded-full border border-white/10" />
            <OrbitChannel icon={Globe} label="Web" angle={0} />
            <OrbitChannel icon={MessageSquare} label="WhatsApp" angle={120} />
            <OrbitChannel icon={Cpu} label="API" angle={240} />

            {/* Simulated Activity Packets */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,1)]"
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos((i * 60 * Math.PI) / 180) * 140,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 140,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}

        {/* SCENE 7: LOOP RESET */}
        {phase === 6 && (
          <motion.div key="scene7" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.5 } }}
          >
            {/* Core expanding back to files */}
             <motion.div 
               className="w-16 h-16 rounded-full bg-purple-500 shadow-[0_0_100px_rgba(168,85,247,1)]"
               animate={{ scale: [1, 5], opacity: [1, 0] }}
               transition={{ duration: 2, ease: "easeOut" }}
             />
             <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
               <span className="text-white font-mono text-sm tracking-[0.2em] uppercase">Recompiling</span>
             </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Subcomponents for the scenes
function DocIcon({ Icon, label, startPos, delay }: any) {
  return (
    <motion.div 
      className="absolute flex flex-col items-center gap-2"
      initial={{ x: startPos.x, y: startPos.y, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1, scale: [1, 1.2, 0] }}
      transition={{ 
        opacity: { duration: 0.5, delay },
        x: { duration: 1.5, delay, ease: "backIn" },
        y: { duration: 1.5, delay, ease: "backIn" },
        scale: { duration: 2.5, delay }
      }}
    >
      <div className="w-12 h-12 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
      <span className="text-xs font-mono text-slate-400">{label}</span>
    </motion.div>
  );
}

function MemoryNode({ label, pos, color, delay }: any) {
  return (
    <motion.div 
      className="absolute flex flex-col items-center"
      initial={{ x: pos.x, y: pos.y, scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
    >
      <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${color} opacity-80 blur-sm absolute`} />
      <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white/20 relative z-10 flex items-center justify-center shadow-xl">
        <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${color}`} />
      </div>
      <span className="absolute top-16 text-xs font-medium text-slate-300 whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

function OrbitChannel({ icon: Icon, label, angle }: any) {
  return (
    <motion.div 
      className="absolute top-1/2 left-1/2 flex flex-col items-center"
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ 
        x: Math.cos((angle * Math.PI) / 180) * 140, 
        y: Math.sin((angle * Math.PI) / 180) * 140,
        opacity: 1
      }}
      transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
    >
      <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="absolute top-12 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-950/80 px-2 py-0.5 rounded">{label}</span>
    </motion.div>
  );
}
