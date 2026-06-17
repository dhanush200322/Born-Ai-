import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How long does it take to train an agent?',
    a: 'Most agents are ready in minutes. Once you upload your documents or provide a website URL, our system processes the data and generates a ready-to-use agent almost instantly.'
  },
  {
    q: 'Can I deploy my agent to WhatsApp?',
    a: 'Yes! Our Pro and Business plans include direct integration with the WhatsApp Business API, allowing your agent to interact with customers right where they are.'
  },
  {
    q: 'How does the long-term memory work?',
    a: 'Agents use advanced vector storage and session tracking to remember user preferences, past interactions, and context across multiple conversations.'
  },
  {
    q: 'Do I need coding skills to use Born AI?',
    a: 'Not at all. The platform features a visual, no-code Agent Builder. However, if you are a developer, we provide robust REST APIs for custom integrations.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-950/80 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-lg">Everything you need to know about Born AI.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="border border-white/10 rounded-2xl bg-slate-900/50 overflow-hidden hover:border-purple-500/30 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180 text-purple-400' : 'group-hover:text-purple-400'}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-4 text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
