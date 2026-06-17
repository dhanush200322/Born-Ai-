import React, { useState } from 'react';
import { ChartBlock, MermaidBlock, TimelineBlock, KPIBlock, ContactBlock, PricingBlock, FAQBlock } from './StructuredDataBlocks';
import { Copy, Check } from 'lucide-react';

export const MarkdownRenderers = {
  // Enhanced Code Block with Interceptors
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const content = String(children).replace(/\n$/, '').replace(/▍/g, '');

    // Intercept JSON structured blocks
    if (!inline && language.startsWith('json-')) {
      try {
        const data = JSON.parse(content);
        switch (language) {
          case 'json-chart': return <ChartBlock data={data} />;
          case 'json-timeline': return <TimelineBlock data={data} />;
          case 'json-kpi': return <KPIBlock data={data} />;
          case 'json-contact': return <ContactBlock data={data} />;
          case 'json-pricing': return <PricingBlock data={data} />;
          case 'json-faq': return <FAQBlock data={data} />;
          default: break; // Fallback to normal code block
        }
      } catch (e) {
        console.error(`Failed to parse ${language} block`, e);
      }
    }

    // Intercept Mermaid
    if (!inline && language === 'mermaid') {
      return <MermaidBlock code={content} />;
    }

    // Normal Code Block
    if (!inline && match) {
      const [copied, setCopied] = useState(false);
      
      const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      return (
        <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{language}</span>
            <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors p-1">
              {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-emerald-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <div className="overflow-x-auto p-4 text-sm leading-relaxed">
            <code className={className} {...props}>
              {children}
            </code>
          </div>
        </div>
      );
    }

    // Inline Code
    return (
      <code className="bg-white/10 text-purple-300 rounded px-1.5 py-0.5 text-[0.85em] font-mono" {...props}>
        {children}
      </code>
    );
  },

  // Premium Tables
  table({ children }: any) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border border-white/10 shadow-lg">
        <table className="w-full text-sm text-left text-slate-300">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: any) {
    return <thead className="text-xs text-slate-400 uppercase bg-slate-800/80">{children}</thead>;
  },
  th({ children }: any) {
    return <th className="px-4 py-3 font-semibold tracking-wider border-b border-white/10 whitespace-nowrap">{children}</th>;
  },
  td({ children }: any) {
    return <td className="px-4 py-3 border-b border-white/5 group-hover:bg-white/[0.02]">{children}</td>;
  },
  tr({ children }: any) {
    return <tr className="group hover:bg-white/[0.02] transition-colors">{children}</tr>;
  },

  // Links
  a({ children, href }: any) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">{children}</a>;
  },

  // Checklists & Lists
  li({ children, className }: any) {
    if (className === 'task-list-item') {
      return <li className="flex items-center gap-2 my-1">{children}</li>;
    }
    return <li className="my-1 text-slate-300">{children}</li>;
  },

  // Blockquotes (Differentiated Question Boxes)
  blockquote({ children }: any) {
    return (
      <blockquote className="my-6 border-l-4 border-indigo-500 bg-indigo-500/10 p-4 rounded-r-xl italic text-slate-300 shadow-inner">
        {children}
      </blockquote>
    );
  },
  
  // Headings
  h1: ({children}: any) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight">{children}</h1>,
  h2: ({children}: any) => <h2 className="text-xl font-bold text-white mt-6 mb-3 tracking-tight">{children}</h2>,
  h3: ({children}: any) => <h3 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h3>,
  h4: ({children}: any) => <h4 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h4>,
  
  // Paragraphs
  p: ({children}: any) => <p className="mb-4 text-slate-300 leading-relaxed last:mb-0">{children}</p>,
};
