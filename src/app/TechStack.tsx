'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TechCategory = ({ title, tags, index }: { title: string; tags: string[]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="flex flex-col gap-4 p-6 border-l border-white/10 hover:border-purple-500 transition-colors duration-300"
  >
    <h3 className="text-purple-500 text-sm font-bold uppercase tracking-widest mb-2">{title}</h3>
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {tags.map((tag, i) => (
        <span key={i} className="text-lg md:text-xl text-gray-300 leading-relaxed">
          {tag} {i !== tags.length - 1 && <span className="text-gray-600 mx-1">•</span>}
        </span>
      ))}
    </div>
  </motion.div>
);

export default function TechStack() {
  const categories = [
    { title: "Frontend", tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"] },
    { title: "Backend", tags: ["Node.js", "Express", "PostgreSQL", "Firebase", "Supabase"] },
    { title: "Design", tags: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Blender"] },
    { title: "Tools", tags: ["Git", "Docker", "Webpack", "Vite", "VS Code"] },
    { title: "Testing", tags: ["Jest", "Cypress", "React Testing Library"] },
    { title: "Architecture", tags: ["REST API", "GraphQL", "Microservices", "Serverless"] },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-black">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white mb-4">
          Technology<br />Arsenal
        </h2>
        <div className="h-1 w-24 bg-purple-500" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <TechCategory key={i} {...cat} index={i} />
        ))}
      </div>
    </section>
  );
}