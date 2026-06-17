import React from 'react';
import { Search, Bell, Command, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommandCenter() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      
      {/* Search / Command Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-16 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            placeholder="Search agents, knowledge bases, or commands..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-white/10">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-slate-950"></span>
        </motion.button>

        <div className="h-6 w-px bg-white/10 mx-2"></div>

        <button className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-lg transition-colors border border-transparent hover:border-white/10">
          <UserCircle className="w-7 h-7 text-indigo-400" />
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-white leading-tight">Acme Corp</p>
            <p className="text-xs text-slate-400">Enterprise Plan</p>
          </div>
        </button>
      </div>
    </header>
  );
}
