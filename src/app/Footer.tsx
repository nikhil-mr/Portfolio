'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

const MagneticButton = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative flex items-center gap-4 px-8 py-4 md:px-12 md:py-6 bg-white text-black rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-colors duration-300"
    >
      {children}
    </motion.a>
  );
};

export default function Footer() {
  return (
    <footer className="relative min-h-screen flex flex-col justify-between pt-20 pb-10 px-6 md:px-12 bg-black overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-12 mt-auto mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          <MagneticButton href="mailto:12nikhilreji@email.com">
            <Mail className="w-6 h-6" />
            Email Me
          </MagneticButton>
          <MagneticButton href="tel:+916238984317">
            <Phone className="w-6 h-6" />
            Call Me
          </MagneticButton>
        </div>
      </div>

      <div className="relative z-10">
        <motion.h1 
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[25vw] leading-[0.8] font-bold text-center text-transparent stroke-text hover:text-purple-500 transition-colors duration-500 select-none"
          style={{ WebkitTextStroke: "2px white" }}
        >
          NIKHIL
        </motion.h1>
      </div>
    </footer>
  );
}