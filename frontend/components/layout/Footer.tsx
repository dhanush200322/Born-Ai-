import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Born AI</span>
          </div>
          <p className="text-slate-400 text-sm">
            Empowering businesses with intelligent, memory-enabled AI agents.
          </p>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-purple-400 transition-colors">Agent Builder</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Knowledge Base</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Integrations</a></li>
            <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
          </ul>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Community</a></li>
          </ul>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
          </ul>
        </motion.div>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Born AI. All rights reserved.
      </div>
    </footer>
  );
}
