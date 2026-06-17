import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import Header from '../../components/create-agent/Header';
import LivePreview from '../../components/create-agent/LivePreview';

import Step1Details from '../../components/create-agent/steps/Step1Details';
import Step2Knowledge from '../../components/create-agent/steps/Step2Knowledge';
import Step3Memory from '../../components/create-agent/steps/Step3Memory';
import Step4Channels from '../../components/create-agent/steps/Step4Channels';
import Step5Review from '../../components/create-agent/steps/Step5Review';

import { AgentBackendPayload, defaultAgentPayload } from '../../lib/types/agent';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

export default function CreateAgentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [payload, setPayload] = useState<AgentBackendPayload>(defaultAgentPayload);
  const [isDeploying, setIsDeploying] = useState(false);

  const updatePayload = (data: Partial<AgentBackendPayload>) => {
    setPayload(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    // Simulate backend deployment
    setTimeout(() => {
      setIsDeploying(false);
      router.push('/dashboard'); // Redirect back to dashboard on success
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Create Agent - Born AI OS</title>
      </Head>

      <div className="min-h-screen bg-[#071020] font-sans selection:bg-purple-500/30 text-white pb-20">
        
        {/* Global Background Glow */}
        <div className="fixed top-0 left-0 right-0 h-[800px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

        <Header currentStep={currentStep} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Center Column: Steps */}
            <div className="lg:col-span-2 space-y-8 pb-32">
              <AnimatePresence mode="wait">
                {currentStep === 1 && <Step1Details key="1" payload={payload} updatePayload={updatePayload} />}
                {currentStep === 2 && <Step2Knowledge key="2" payload={payload} updatePayload={updatePayload} />}
                {currentStep === 3 && <Step3Memory key="3" payload={payload} updatePayload={updatePayload} />}
                {currentStep === 4 && <Step4Channels key="4" payload={payload} updatePayload={updatePayload} />}
                {currentStep === 5 && <Step5Review key="5" payload={payload} isDeploying={isDeploying} onDeploy={handleDeploy} />}
              </AnimatePresence>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-1">
              <LivePreview payload={payload} />
            </div>
            
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <Button onClick={handleBack} variant="outline" className="bg-slate-900 border-white/10 text-white hover:bg-white/10 h-11 px-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              {currentStep < 5 && (
                <Button onClick={handleNext} className="bg-white text-slate-950 hover:bg-slate-200 h-11 px-8">
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
