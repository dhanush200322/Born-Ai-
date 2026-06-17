import React from 'react';
import { motion } from 'framer-motion';

export const VoiceWave: React.FC = () => {
  return (
    <div className="flex items-center gap-[3px] h-6 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-purple-500 rounded-full"
          animate={{
            height: ["20%", "80%", "40%", "100%", "30%"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          style={{ height: "20%" }}
        />
      ))}
    </div>
  );
};
