import React, { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '../../components/dashboard/Sidebar';
import CommandCenter from '../../components/dashboard/CommandCenter';
import MetricsCards from '../../components/dashboard/MetricsCards';
import TopAgents from '../../components/dashboard/TopAgents';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import OnboardingState from '../../components/dashboard/OnboardingState';

export default function DashboardPage() {
  // Toggle this state to see the onboarding view vs populated view
  const [hasAgents, setHasAgents] = useState(true);

  return (
    <>
      <Head>
        <title>Dashboard - Born AI OS</title>
      </Head>

      <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-purple-500/30">
        
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col relative min-h-screen">
          
          {/* Global Background Glow */}
          <div className="fixed top-0 left-64 right-0 h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

          {/* Top Command Bar */}
          <CommandCenter />

          {/* Page Content */}
          <main className="flex-1 p-8 z-10 overflow-y-auto">
            
            {/* Quick Demo Toggle (For Development) */}
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setHasAgents(!hasAgents)}
                className="text-xs px-3 py-1 rounded bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
              >
                Toggle View: {hasAgents ? 'Populated' : 'Onboarding'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!hasAgents ? (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <OnboardingState />
                </motion.div>
              ) : (
                <motion.div
                  key="populated"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <MetricsCards />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <TopAgents />
                    </div>
                    <div className="lg:col-span-1">
                      <ActivityFeed />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>
    </>
  );
}
