'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col pt-20 pb-20 px-6 md:px-12">
      {/* Horizontal Split Header */}
      <div className="mb-20 md:mb-32">
        <motion.h1 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10vw] leading-[0.85] font-bold uppercase tracking-tighter text-white mix-blend-difference"
        >
          UI & UX Designer.<br />
          <span className="text-gray-500">Full-Stack.</span>
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        {/* Left Side: Bio */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-300">
              I craft digital experiences that merge art with engineering. With a deep focus on interaction design and performance, I build scalable applications that feel alive.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-300">
              My approach is rooted in a grid philosophy—bringing order to chaos while leaving room for creative disruption.
            </p>
          </motion.div>
        </div>

        {/* Middle: Headshot with Parallax */}
        <div className="md:col-span-7 relative h-[50vh] md:h-[70vh] overflow-hidden rounded-sm">
          <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
            <img 
              src="/Myself.jpeg" 
              alt="Headshot" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}