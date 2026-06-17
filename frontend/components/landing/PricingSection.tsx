import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    duration: '30 Days',
    features: ['1 AI Agent', 'Basic Knowledge Base', 'Website Integration', 'Community Support'],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Starter',
    price: '$49',
    duration: 'per month',
    features: ['1 AI Agent', 'Advanced RAG', 'Website Integration', 'Email Support'],
    cta: 'Get Starter',
    popular: false
  },
  {
    name: 'Pro',
    price: '$149',
    duration: 'per month',
    features: ['Multiple Agents', 'Long-Term Memory', 'WhatsApp Integration', 'Priority Support'],
    cta: 'Get Pro',
    popular: true
  },
  {
    name: 'Business',
    price: '$499',
    duration: 'per month',
    features: ['Unlimited Agents', 'Team Access', 'API Access', 'Dedicated Account Manager'],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the perfect plan for your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular ? 'bg-slate-900 border-purple-500 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/30' : 'bg-slate-900/50 border-white/10 hover:border-white/30'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.duration}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-purple-400" />
                    </div>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.cta === 'Contact Sales' ? (
                <Button 
                  variant={plan.popular ? 'default' : 'outline'} 
                  className={`w-full transition-all duration-300 ${plan.popular ? 'bg-white text-slate-950 hover:bg-slate-200 hover:text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent'}`}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Link href="/login" className="w-full">
                  <Button 
                    variant={plan.popular ? 'default' : 'outline'} 
                    className={`w-full transition-all duration-300 ${plan.popular ? 'bg-white text-slate-950 hover:bg-slate-200 hover:text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent'}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
