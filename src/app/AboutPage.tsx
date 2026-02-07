'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Hero from './Hero';
import Stats from './Stats';
import Marquee from './Marquee';
import TechStack from './TechStack';
import Footer from './Footer';

export default function AboutPage({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    // Optional: Lock body scroll or change background if needed
    document.body.style.backgroundColor = '#000000';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] min-h-screen bg-black text-white overflow-y-auto overflow-x-hidden selection:bg-purple-500 selection:text-white"
    >
      {/* Navigation / Close Button */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 md:p-8 mix-blend-difference">
        <div className="text-xl font-bold tracking-tighter">NIKHIL.DEV</div>
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm uppercase tracking-widest hover:text-purple-500 transition-colors cursor-pointer"
        >
          <span>Close</span>
          <div className="p-2 border border-white/20 rounded-full group-hover:border-purple-500 transition-colors">
            <X className="w-4 h-4" />
          </div>
        </button>
      </nav>

      <main className="relative z-10 pt-20">
        <Hero />
        <Stats />
        <Marquee />
        <TechStack />
        <Footer />
      </main>
    </motion.div>
  );
}