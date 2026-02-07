'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MarqueeItem = ({ text, direction = "left", angle = 0 }: { text: string; direction?: "left" | "right"; angle?: number }) => {
  return (
    <div 
      className="absolute left-0 w-full flex overflow-hidden py-4 bg-purple-500 text-black border-y-2 border-black"
      style={{ transform: `rotate(${angle}deg)`, zIndex: angle > 0 ? 10 : 0 }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: direction === "left" ? "-50%" : "0%" }}
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            {text} •
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default function Marquee() {
  return (
    <section className="relative h-[40vh] md:h-[60vh] overflow-hidden flex items-center justify-center bg-black">
      <MarqueeItem text="Creative Developer" direction="left" angle={-5} />
      <MarqueeItem text="UI/UX Designer" direction="right" angle={5} />
    </section>
  );
}