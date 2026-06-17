import { motion, useReducedMotion } from 'framer-motion'
import React from 'react'

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const heading = {
    initial: { y: 20, opacity: 0 },
    
    transition: { duration: 0.6 },
  }

  const imageAnim = reduceMotion
    ? { initial: {}, animate: {} }
    : { initial: { x: 40, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.6 } }

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.h1 {...heading} className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Build a premium website, faster
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-gray-600 max-w-xl">
            Agency-style layouts and smooth micro-interactions powered by UI/UX Pro Max.
          </motion.p>

          <div className="mt-8 flex gap-4">
            <motion.a whileHover={{ scale: 1.03 }} className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500" href="#" role="button">
              Get Started
            </motion.a>

            <a href="#features" className="inline-flex items-center justify-center rounded-md border border-gray-200 px-5 py-3 text-gray-700">
              Learn more
            </a>
          </div>
        </div>

        <motion.div {...imageAnim} className="flex-1">
          <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-slate-50">
            <div className="w-full h-56 bg-gradient-to-r from-indigo-100 to-pink-100 flex items-center justify-center text-gray-400">
              <span className="text-sm">Screenshot placeholder</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="#eef2ff" />
              <stop offset="100%" stopColor="#fff1f2" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#g)" />
        </svg>
      </div>
    </section>
  )
}
