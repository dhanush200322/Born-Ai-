import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Agent Details' },
  { id: 2, name: 'Knowledge Base' },
  { id: 3, name: 'Memory' },
  { id: 4, name: 'Channels' },
  { id: 5, name: 'Deploy' },
];

export default function Header({ currentStep }: Props) {
  return (
    <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Create New Agent</h1>
              <p className="text-sm text-slate-400">Build, train and deploy an AI employee in minutes</p>
            </div>
          </div>

          <nav aria-label="Progress" className="hidden md:block">
            <ol role="list" className="flex items-center gap-2">
              {steps.map((step, stepIdx) => {
                const isCurrent = step.id === currentStep;
                const isComplete = step.id < currentStep;

                return (
                  <li key={step.name} className="flex items-center">
                    <div className="flex items-center">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium border ${
                        isCurrent ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                        isComplete ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                        'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                        {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                      </span>
                      <span className={`ml-2 text-sm font-medium ${
                        isCurrent ? 'text-white' : isComplete ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className={`w-8 h-[1px] mx-3 ${isComplete ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

        </div>
      </div>
    </div>
  );
}
