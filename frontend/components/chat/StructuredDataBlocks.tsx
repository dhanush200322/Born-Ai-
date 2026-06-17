import React, { useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import mermaid from 'mermaid';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, Globe, MapPin, Check, ExternalLink } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

// Colors for charts
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export const ChartBlock = ({ data }: { data: any }) => {
  if (!data || !data.type || !data.data) return <div className="text-red-400 text-sm">Invalid chart data</div>;

  const renderChart = () => {
    switch (data.type) {
      case 'bar':
        return (
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
            <YAxis stroke="#a1a1aa" fontSize={12} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
            <YAxis stroke="#a1a1aa" fontSize={12} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }} />
            <Legend />
            <Pie data={data.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
            <YAxis stroke="#a1a1aa" fontSize={12} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="x" type="number" name="X" stroke="#a1a1aa" fontSize={12} />
            <YAxis dataKey="y" type="number" name="Y" stroke="#a1a1aa" fontSize={12} />
            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }} />
            <Legend />
            <Scatter name="Data" data={data.data} fill="#f59e0b" />
          </ScatterChart>
        );
      default:
        return <div className="text-slate-400">Unsupported chart type</div>;
    }
  };

  return (
    <div className="my-6 p-4 bg-slate-900/50 border border-white/10 rounded-2xl">
      {data.title && <h4 className="text-white font-semibold mb-4 text-center">{data.title}</h4>}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MermaidBlock = ({ code }: { code: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, code).then((result) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
      }).catch(err => {
        console.error('Mermaid render error', err);
        if (containerRef.current) containerRef.current.innerHTML = '<div class="text-red-400 text-sm">Failed to render diagram</div>';
      });
    }
  }, [code]);

  return (
    <div className="my-6 p-4 bg-slate-900 border border-white/10 rounded-2xl overflow-x-auto flex justify-center">
      <div ref={containerRef} className="mermaid-diagram" />
    </div>
  );
};

export const TimelineBlock = ({ data }: { data: any[] }) => {
  if (!Array.isArray(data)) return null;
  return (
    <div className="my-6 space-y-4 border-l-2 border-purple-500/30 ml-3 pl-6 relative">
      {data.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative">
          <div className="absolute -left-[31px] top-1 w-3 h-3 bg-purple-500 rounded-full ring-4 ring-slate-900" />
          <div className="bg-slate-800/50 border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">{item.year || item.date}</span>
              <h4 className="text-white font-medium m-0">{item.title}</h4>
            </div>
            {item.description && <p className="text-sm text-slate-400 m-0 mt-2">{item.description}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const KPIBlock = ({ data }: { data: any[] }) => {
  if (!Array.isArray(data)) return null;
  return (
    <div className="my-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((kpi, i) => (
        <div key={i} className="bg-slate-800/50 border border-white/10 p-4 rounded-xl flex flex-col">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{kpi.label}</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{kpi.value}</span>
            {kpi.trend && (
              <span className={`text-xs font-medium mb-1 ${kpi.trend.startsWith('+') || kpi.trend.startsWith('Up') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {kpi.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ContactBlock = ({ data }: { data: any }) => {
  return (
    <div className="my-6 bg-slate-800 border border-white/10 p-5 rounded-xl max-w-sm">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl">
          {data.name?.charAt(0) || 'C'}
        </div>
        <div>
          <h4 className="text-white font-semibold m-0">{data.name}</h4>
          {data.role && <p className="text-xs text-slate-400 m-0">{data.role}</p>}
        </div>
      </div>
      <div className="space-y-3">
        {data.email && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Mail className="w-4 h-4 text-slate-500" /> <a href={`mailto:${data.email}`} className="hover:text-purple-400 transition-colors">{data.email}</a>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Phone className="w-4 h-4 text-slate-500" /> <a href={`tel:${data.phone}`} className="hover:text-purple-400 transition-colors">{data.phone}</a>
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Globe className="w-4 h-4 text-slate-500" /> <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-1">{data.website} <ExternalLink className="w-3 h-3" /></a>
          </div>
        )}
        {data.address && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" /> <span>{data.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const PricingBlock = ({ data }: { data: any[] }) => {
  if (!Array.isArray(data)) return null;
  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((plan, i) => (
        <div key={i} className={`bg-slate-900 border ${plan.recommended ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-white/10'} p-5 rounded-2xl relative flex flex-col`}>
          {plan.recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Recommended</div>}
          <h4 className="text-white font-medium m-0 mb-2">{plan.plan}</h4>
          <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-white/5">
            <span className="text-3xl font-bold text-white">{plan.price}</span>
            {plan.period && <span className="text-xs text-slate-400">/{plan.period}</span>}
          </div>
          <ul className="space-y-2 flex-1 m-0 p-0 list-none">
            {plan.features?.map((feat: string, j: number) => (
              <li key={j} className="flex items-start gap-2 text-sm text-slate-300 m-0">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export const FAQBlock = ({ data }: { data: any[] }) => {
  if (!Array.isArray(data)) return null;
  return (
    <div className="my-6 space-y-2">
      {data.map((faq, i) => {
        const [open, setOpen] = React.useState(false);
        return (
          <div key={i} className="bg-slate-800/40 border border-white/10 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
              <span className="font-medium text-white text-sm">{faq.question}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="p-4 pt-0 text-sm text-slate-300 border-t border-white/5">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
