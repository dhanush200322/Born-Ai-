import React from 'react';
import { motion } from 'framer-motion';
import { Users, HeadphonesIcon, TrendingUp, BookOpen } from 'lucide-react';

const cases = [
  { icon: Users, title: 'HR Agent', desc: 'Onboard employees, answer policy questions, and manage time-off requests automatically.' },
  { icon: HeadphonesIcon, title: 'Customer Support', desc: 'Resolve tickets instantly, access customer history via memory, and escalate when necessary.' },
  { icon: TrendingUp, title: 'Sales Agent', desc: 'Qualify leads, book meetings directly to calendar, and answer pricing questions.' },
  { icon: BookOpen, title: 'Internal Knowledge', desc: 'Search through company wikis, technical docs, and internal guidelines instantly.' }
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24 bg-slate-950/80 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for Every Team</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Deploy specialized agents across different departments to automate your entire business.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cases.map((uc, i) => (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5, scale: 1.02 }}
              key={uc.title}
              className="p-8 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <uc.icon className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{uc.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{uc.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
