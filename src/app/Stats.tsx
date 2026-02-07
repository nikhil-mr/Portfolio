'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const MetricCard = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseXVal = e.clientX - rect.left;
      const mouseYVal = e.clientY - rect.top;
      const xPct = mouseXVal / width - 0.5;
      const yPct = mouseYVal / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative h-64 md:h-80 border border-white/20 bg-black p-8 flex flex-col justify-between group hover:border-purple-500 transition-colors duration-500"
    >
      <div className="text-sm text-gray-500 uppercase tracking-widest group-hover:text-purple-500 transition-colors">
        {label}
      </div>
      <div className="text-6xl md:text-8xl font-bold text-white group-hover:translate-z-10 transition-transform" style={{ transform: "translateZ(20px)" }}>
        {value}
      </div>
    </motion.div>
  );
};

export default function Stats() {
  const metrics = [
    { value: "5+", label: "Projects Created" },
    { value: "30+", label: "Posters Designed" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-32 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <MetricCard key={i} {...metric} />
        ))}
      </div>
    </section>
  );
}