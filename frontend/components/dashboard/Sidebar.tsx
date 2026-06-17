import React from 'react';
import Link from 'next/link';
import { Bot, LayoutDashboard, PlusCircle, Users, Database, Zap, BarChart2, CreditCard, Settings, LogOut } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: PlusCircle, label: 'Create Agent', href: '/dashboard/create', active: false },
  { icon: Users, label: 'My Agents', href: '/dashboard', active: false },
  { icon: Database, label: 'Knowledge Bases', href: '/dashboard/knowledge', active: false },
  { icon: Zap, label: 'Integrations', href: '/dashboard/integrations', active: false },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics', active: false },
];

const bottomNavItems = [
  { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-slate-950/50 border-r border-white/10 backdrop-blur-xl flex flex-col z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Born AI</span>
        </Link>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Platform
      </div>
      
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              item.active 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 mt-auto border-t border-white/10 space-y-1 bg-slate-950">
        {bottomNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent"
          >
            <item.icon className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
