import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  // Scroll tracking
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  
  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  // Parallax mappings based on mouse (Foreground moves more, background moves less/opposite)
  const fgX = useTransform(smoothMouseX, [-1, 1], [-40, 40]);
  const fgY = useTransform(smoothMouseY, [-1, 1], [-40, 40]);
  
  const mgX = useTransform(smoothMouseX, [-1, 1], [20, -20]);
  const mgY = useTransform(smoothMouseY, [-1, 1], [20, -20]);

  const bgX = useTransform(smoothMouseX, [-1, 1], [10, -10]);
  const bgY = useTransform(smoothMouseY, [-1, 1], [10, -10]);

  // Scroll mapping
  const scrollZ = useTransform(smoothScroll, [0, 1], [0, -500]);

  if (!mounted) return <div className="fixed inset-0 bg-slate-950 -z-50" />;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-[#020617]" style={{ perspective: '1500px' }}>
      
      {/* Layer 1: Deep Space Gradient (Static Base) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />

      <motion.div style={{ z: scrollZ, transformStyle: 'preserve-3d' }} className="absolute inset-0">
        
        {/* Layer 2: Aurora Waves (Background Depth) */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{ x: bgX, y: bgY, translateZ: -300 }}
        >
          <motion.div 
            className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[180px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full bg-fuchsia-600/20 blur-[180px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Layer 3: Knowledge Network (Midground Depth) */}
        <motion.div 
          className="absolute inset-0 opacity-15"
          style={{ x: mgX, y: mgY, translateZ: -100 }}
        >
          {/* Creating an abstract SVG network */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </linearGradient>
            </defs>
            <motion.path 
              d="M 100 200 L 400 150 L 600 400 L 900 250 L 1200 500 M 300 600 L 600 400 M 900 250 L 800 100" 
              fill="none" stroke="url(#lineGrad)" strokeWidth="1"
              animate={{ strokeDasharray: ["0, 1000", "1000, 0"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Layer 4: Streaming Data Packets (Midground Depth) */}
        {!shouldReduceMotion && (
          <motion.div style={{ x: mgX, y: mgY, translateZ: 0 }} className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white/40 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -200 - 100],
                  x: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Layer 5: Deployment Orbit Rings (Foreground Depth) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center opacity-10"
          style={{ x: fgX, y: fgY, translateZ: 100 }}
        >
           <motion.div 
             className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full border-[1px] border-indigo-500/30"
             animate={{ rotate: 360 }}
             transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           />
           <motion.div 
             className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full border-[1px] border-purple-500/20"
             animate={{ rotate: -360 }}
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
           />
        </motion.div>

        {/* Layer 6: Parallax Noise Texture Overlay (Replaces static noise with animated CSS mix-blend) */}
        {/* User requested removal of noise layer, so Layer 6 is just the parallax depth handled by transform Z */}

      </motion.div>
    </div>
  );
}
