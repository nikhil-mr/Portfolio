'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { Menu, ChevronRight } from 'lucide-react';

export default function Portfolio() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white cursor-none [&_*]:cursor-none">
      <Cursor />
      <AnimatePresence mode="wait">
        {!isIntroComplete ? (
          <IntroAnimation key="intro" onComplete={() => setIsIntroComplete(true)} />
        ) : (
          <HomePage key="home" />
        )}
      </AnimatePresence>
    </div>
  );
}

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollProgress = useMotionValue(0);
  const [currentText, setCurrentText] = useState("DEVELOPER");
  
  const whiteHeight = useTransform(scrollProgress, [0, 0.5], ["25vh", "100vh"]);
  const blackHeight = useTransform(scrollProgress, [0.5, 1], ["0vh", "100vh"]);
  const textOpacity = useTransform(scrollProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const handleWheel = (e: WheelEvent) => {
      const sensitivity = 0.0005;
      const current = scrollProgress.get();
      const newProgress = current + e.deltaY * sensitivity;
      
      if (newProgress >= 1.1) {
         onComplete();
      } else {
        scrollProgress.set(Math.max(0, newProgress));
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isLoaded, scrollProgress, onComplete]);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (latest < 0.33) setCurrentText("DEVELOPER");
    else if (latest < 0.66) setCurrentText("DESIGNER");
    else setCurrentText("GAMER");
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center z-40 mix-blend-difference pointer-events-none">
        <h1 className="text-6xl md:text-9xl font-bold text-white tracking-tighter uppercase">
          {!isLoaded ? `${count}%` : currentText}
        </h1>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 bg-white z-20 flex items-center justify-center overflow-hidden"
        style={{ 
          width: isLoaded ? "100%" : `${count}%`,
          height: isLoaded ? whiteHeight : "25vh"
        }}
      >
        {isLoaded && (
           <motion.span 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             style={{ opacity: textOpacity }}
             className="text-black text-sm uppercase tracking-widest absolute bottom-8"
           >
             Start Scrolling
           </motion.span>
        )}
      </motion.div>

      <motion.div 
        style={{ height: blackHeight }}
        className="absolute bottom-0 left-0 w-full bg-black z-30"
      />
    </motion.div>
  );
};

const AnimatedHamburgerIcon = ({ isOpen }: { isOpen: boolean }) => {
  const common = {
    className: "w-6 h-0.5 bg-black rounded-full absolute",
    transition: { duration: 0.3, ease: "easeInOut" } as const,
    initial: "closed",
    animate: isOpen ? "open" : "closed",
  };

  return (
    <div className="w-6 h-6 relative">
      <motion.div
        {...common}
        variants={{
          closed: { top: "20%", rotate: 0 },
          open: { top: "50%", y: "-50%", rotate: 45 },
        }}
      />
      <motion.div
        {...common}
        style={{ top: "50%", y: "-50%" }}
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <motion.div
        {...common}
        variants={{
          closed: { bottom: "20%", rotate: 0 },
          open: { bottom: "50%", y: "50%", rotate: -45 },
        }}
      />
    </div>
  );
};

const MenuLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <Link href={href} className="text-xl font-semibold hover:text-purple-400 transition-colors uppercase tracking-widest">
      {children}
    </Link>
  );
};

const NavMenu = ({ isOpen }: { isOpen: boolean }) => {
  const [isWorksHovered, setIsWorksHovered] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-28 right-6 z-50 bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col items-end gap-5">
            <MenuLink href="#">Home</MenuLink>
            <MenuLink href="#">About</MenuLink>
            <motion.div
              className="relative flex items-center gap-2"
              onHoverStart={() => setIsWorksHovered(true)}
              onHoverEnd={() => setIsWorksHovered(false)}
            >
              <MenuLink href="#">Works</MenuLink>
              <motion.div animate={{ x: isWorksHovered ? 3 : 0 }} transition={{ duration: 0.2 }}>
                 <ChevronRight size={18} />
              </motion.div>
              <AnimatePresence>
                {isWorksHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="absolute right-[120%] top-1/2 -translate-y-1/2 flex flex-col gap-3 whitespace-nowrap bg-black/30 p-4 rounded-xl"
                  >
                    <MenuLink href="#">Posters</MenuLink>
                    <MenuLink href="#">Websites</MenuLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <MenuLink href="#">Content</MenuLink>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CharacterTypingEffect = ({ text, delay }: { text: string; delay: number }) => {
  const characters = text.split("");
  return (
    <p className="text-xl font-light text-gray-600 leading-relaxed">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * 0.015, duration: 0 }}
        >
          {char}
        </motion.span>
      ))}
    </p>
  );
};

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollY } = useScroll();
  const [showHamburger, setShowHamburger] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    if (isMenuOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window !== 'undefined') {
      const shouldShow = latest > window.innerHeight;
      setShowHamburger(shouldShow);
      if (!shouldShow) setIsMenuOpen(false);
    }
  });

  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start start", "end end"],
  });

  const aboutBg = useTransform(aboutProgress, [0, 0.1], ["#FFFFFF", "#18181B"]);

  const [activeSection, setActiveSection] = useState<'intro' | 'text' | 'posters' | 'projects'>('intro');
  const [showPostersGrid, setShowPostersGrid] = useState(false);
  const [showProjectsGrid, setShowProjectsGrid] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef,
    offset: ["start start", "end end"],
  });

  const textOpacity = useTransform(statsProgress, [0.05, 0.2], [0, 1]);
  const textY = useTransform(statsProgress, [0.05, 0.2], [20, 0]);

  const stat1Opacity = useTransform(statsProgress, [0.15, 0.2], [0, 1]);
  const stat1Y = useTransform(statsProgress, [0.15, 0.2], [50, 0]);

  const stat2Opacity = useTransform(statsProgress, [0.5, 0.55], [0, 1]);
  const stat2Y = useTransform(statsProgress, [0.5, 0.55], [50, 0]);

  const stat3Opacity = useTransform(statsProgress, [0.85, 0.9], [0, 1]);
  const stat3Y = useTransform(statsProgress, [0.85, 0.9], [50, 0]);

  const rightOpacity = useTransform(statsProgress, [0.05, 0.2], [0, 1]);
  const rightY = useTransform(statsProgress, [0.05, 0.2, 1], [20, 0, -50]);

  useMotionValueEvent(statsProgress, "change", (latest) => {
    if (latest < 0.2) {
      setActiveSection('intro');
    } else if (latest < 0.55) {
      setActiveSection('posters');
    } else if (latest < 0.85) {
      setActiveSection('projects');
    } else {
      setActiveSection('text');
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      <NavMenu isOpen={isMenuOpen} />
      <AnimatePresence>
        {showHamburger && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="fixed top-6 right-6 z-50 p-4 bg-white text-black rounded-full mix-blend-difference cursor-pointer"
          >
            <AnimatedHamburgerIcon isOpen={isMenuOpen} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Interaction Section */}
      <div ref={containerRef} className="h-[300vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
          {/* Left Zone - White Background */}
          <div className="w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center relative p-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full md:w-[200%] flex justify-start z-50">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="text-4xl md:text-[10vw] font-bold tracking-tighter text-black uppercase text-left leading-[0.8]"
              >
                Digital Designer<br />& Developer
              </motion.h1>
            </div>

            <div className="flex flex-col items-start gap-1 z-10 max-w-md">
              <div className="flex items-start gap-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ delay: 0.6, duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] mt-3 shrink-0"
                />
                <CharacterTypingEffect 
                  text="I am a passionate Frontend Developer and Digital Designer who blends artistic vision with technical precision. My work focuses on crafting engaging digital products that look exceptional and perform flawlessly across all devices."
                  delay={1.2}
                />
              </div>
            </div>

            <motion.div 
              className="absolute bottom-12 flex flex-col items-center gap-3 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30">Scroll</span>
              <div className="w-[1px] h-12 bg-black/10 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1/2 bg-black"
                  animate={{ top: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Zone - Image Background */}
          <div className="w-full md:w-1/2 h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 md:left-[-100%] w-full md:w-[200%] flex justify-start z-50 hidden md:flex">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="text-4xl md:text-[10vw] font-bold tracking-tighter text-white uppercase text-left leading-[0.8]"
              >
                Digital Designer<br />& Developer
              </motion.h1>
            </div>

            <div className="absolute inset-0 bg-[url('/Myself.jpeg')] bg-cover bg-center" />
            
            {/* Navigation - Bottom Right Vertical */}
            <nav className="absolute bottom-8 right-8 flex flex-col items-end gap-4 z-40 text-white">
              <FlipLink href="#">About</FlipLink>
              <FlipLink href="#">Works</FlipLink>
              <FlipLink href="#">Content</FlipLink>
            </nav>
          </div>
        </div>
      </div>

      {/* About Section */}
      <motion.div ref={aboutRef} style={{ backgroundColor: aboutBg }} className="relative h-[250vh] z-20">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-8 md:p-20 gap-12">
          <TypingText 
            text="I'm Nikhil—a frontend developer crafting fast, scalable, and immersive digital experiences that merge creativity with engineering precision. I specialize in Html, Css, JavaScript, and React." 
            progress={aboutProgress}
            range={[0.1, 0.5]}
          />
          <TypingText 
            text="I am a designer specializing in Figma platform." 
            progress={aboutProgress}
            range={[0.5, 0.7]}
          />
          <motion.button
            style={{ opacity: useTransform(aboutProgress, [0.7, 0.8], [0, 1]) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            About Me
          </motion.button>
        </div>
      </motion.div>

      {/* Stats / Philosophy Section */}
      <div 
        ref={statsRef}
        className={`bg-white rounded-t-[80px] md:rounded-t-[120px] z-30 relative text-black ${
          !showPostersGrid && !showProjectsGrid ? "h-[450vh]" : "min-h-screen"
        }`}
      >
        <div className={`${
          !showPostersGrid && !showProjectsGrid ? "sticky top-0 h-screen" : ""
        } flex flex-col md:flex-row justify-between items-start p-8 md:p-20 gap-12`}>
        {showPostersGrid ? (
          <FullPostersGrid onBack={() => setShowPostersGrid(false)} />
        ) : showProjectsGrid ? (
          <FullProjectsGrid onBack={() => setShowProjectsGrid(false)} />
        ) : (
          <>
            <div className="flex flex-col gap-8 max-w-xl">
              <motion.p 
                style={{ opacity: textOpacity, y: textY }}
                className="text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                Every product I build starts with understanding user goals and translating them into intuitive, high-performance experiences. From concept to launch, I focus on meaningful results—boosting user engagement, retention, and overall business impact.
              </motion.p>
              <div className="flex flex-col gap-4 w-full">
                <motion.div
                  style={{ opacity: stat1Opacity, y: stat1Y }}
                  className="flex flex-col gap-4"
                >
                  <div className="h-px w-full bg-black/20" />
                  <div 
                    className="flex flex-col cursor-pointer group"
                    onClick={() => setActiveSection(activeSection === 'posters' ? 'text' : 'posters')}
                  >
                    <span className="text-sm text-gray-500 uppercase tracking-widest group-hover:text-purple-600 transition-colors">posters designed</span>
                    <span className="text-6xl md:text-8xl font-bold group-hover:scale-105 transition-transform origin-left">30+</span>
                  </div>
                </motion.div>

                <motion.div
                  style={{ opacity: stat2Opacity, y: stat2Y }}
                  className="flex flex-col gap-4"
                >
                  <div className="h-px w-full bg-black/20" />
                  <div 
                    className="flex flex-col cursor-pointer group"
                    onClick={() => setActiveSection(activeSection === 'projects' ? 'text' : 'projects')}
                  >
                    <span className="text-sm text-gray-500 uppercase tracking-widest group-hover:text-purple-600 transition-colors">project completed</span>
                    <span className="text-6xl md:text-8xl font-bold group-hover:scale-105 transition-transform origin-left">5+</span>
                  </div>
                </motion.div>

                <motion.div
                  style={{ opacity: stat3Opacity, y: stat3Y }}
                  className="flex flex-col gap-4"
                >
                  <div className="h-px w-full bg-black/20" />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 uppercase tracking-widest">years of experience</span>
                    <span className="text-6xl md:text-8xl font-bold">1</span>
                  </div>
                </motion.div>
              </div>
            </div>
            <motion.div 
              style={{ opacity: rightOpacity, y: rightY }}
              className="flex flex-col gap-8 max-w-2xl w-full"
            >
              <AnimatePresence mode="wait">
                {activeSection === 'text' && (
                  <motion.h3
                    key="text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-3xl md:text-5xl leading-tight font-semibold"
                  >
                    Driving measurable growth and engagement through thoughtful design and engineering.
                  </motion.h3>
                )}
                {activeSection === 'posters' && (
                  <PosterGallery key="posters" onExpand={() => setShowPostersGrid(true)} scrollProgress={statsProgress} range={[0.2, 0.5]} />
                )}
                {activeSection === 'projects' && (
                  <ProjectGallery key="projects" onExpand={() => setShowProjectsGrid(true)} scrollProgress={statsProgress} range={[0.55, 0.85]} />
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="h-screen bg-zinc-900 flex flex-col items-center justify-center gap-16 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button className="px-12 py-6 bg-white text-black text-2xl font-bold uppercase tracking-[0.2em] rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.5)]">
            Hire Me
          </button>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <a href="mailto:example@email.com" className="flex flex-col items-center gap-2 group">
            <span className="text-xl md:text-2xl font-light uppercase tracking-widest group-hover:text-purple-400 transition-colors">Email</span>
          </a>
          <a href="tel:+1234567890" className="flex flex-col items-center gap-2 group">
            <span className="text-xl md:text-2xl font-light uppercase tracking-widest group-hover:text-purple-400 transition-colors">Phone</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-2 group">
            <span className="text-xl md:text-2xl font-light uppercase tracking-widest group-hover:text-purple-400 transition-colors">GitHub</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-2 group">
            <span className="text-xl md:text-2xl font-light uppercase tracking-widest group-hover:text-purple-400 transition-colors">LinkedIn</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectItem = ({ 
  project, 
  index, 
  onExpand, 
  scrollProgress, 
  range, 
  total 
}: { 
  project: { id: number; name: string; tools: string[] }; 
  index: number; 
  onExpand: () => void; 
  scrollProgress: MotionValue<number>; 
  range: [number, number]; 
  total: number; 
}) => {
  const step = (range[1] - range[0]) / total;
  const start = range[0] + index * step;
  
  const opacity = useTransform(scrollProgress, [start, start + step * 0.6], [0, 1]);
  const y = useTransform(scrollProgress, [start, start + step * 0.6], [50, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      onClick={onExpand}
      className="w-full flex-shrink-0 block cursor-pointer bg-zinc-100 p-8 rounded-lg shadow-sm hover:bg-zinc-200 transition-colors group"
    >
      <h3 className="text-3xl md:text-4xl font-bold text-black uppercase mb-2 group-hover:text-purple-600 transition-colors">
        {String(project.id).padStart(2, '0')} - {project.name}
      </h3>
      <p className="text-gray-600 text-sm md:text-base uppercase tracking-widest">
        Tools Used - {project.tools.join(", ")}
      </p>
    </motion.div>
  );
};

const ProjectGallery = ({ onExpand, scrollProgress, range }: { onExpand: () => void; scrollProgress: MotionValue<number>; range: [number, number] }) => {
  const projects = [
    { id: 1, name: "Jalam", tools: ["React", "Tailwind CSS"] },
    { id: 2, name: "Portfolio", tools: ["Next.js", "Framer Motion"] },
    { id: 3, name: "Profile", tools: ["HTML", "CSS", "JavaScript"] },
    { id: 4, name: "Wedding", tools: ["React", "GSAP"] },
    { id: 5, name: "Quiz App", tools: ["TypeScript", "API"] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-[90vh] overflow-hidden relative rounded-2xl"
    >
      <div className="flex flex-col gap-4 px-4 py-0">
        {projects.map((project, i) => (
          <ProjectItem
            key={project.id}
            project={project}
            index={i}
            onExpand={onExpand}
            scrollProgress={scrollProgress}
            range={range}
            total={projects.length}
          />
         ))}
      </div>
    </motion.div>
  );
};

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  const DURATION = 0.25;
  const STAGGER = 0.025;

  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-2xl font-bold uppercase md:text-4xl"
      style={{ lineHeight: 0.9 }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

const Cursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference"
      style={{ x: mouseX, y: mouseY }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="white" style={{ shapeRendering: "crispEdges" }}>
        <path d="M0 0L0 24L6 18L14 18L0 0Z" />
      </svg>
    </motion.div>
  );
};

const TypingText = ({ text, progress, range }: { text: string; progress: MotionValue<number>; range: [number, number] }) => {
  const characters = text.split("");
  const amount = range[1] - range[0];
  const step = amount / characters.length;

  return (
    <p className="text-xl md:text-4xl font-light leading-relaxed max-w-5xl text-center">
      {characters.map((char, i) => {
        const start = range[0] + (i * step);
        const end = range[0] + ((i + 1) * step);
        return <Char key={i} char={char} progress={progress} range={[start, end]} />;
      })}
    </p>
  );
};

const Char = ({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
};

const PosterGallery = ({ onExpand, scrollProgress, range }: { onExpand: () => void; scrollProgress: MotionValue<number>; range: [number, number] }) => {
  const posters = [
    "/posters/1.png",
    "/posters/2.png",
    "/posters/3.png",
    "/posters/4.png",
    "/posters/5.png",
    "/posters/6.png",
    "/posters/7.png",
    "/posters/8.png",
    "/posters/9.png",
    "/posters/10.png",
    "/posters/11.png",
    "/posters/12.png",
    "/posters/13.png",
    "/posters/14.png",
  ];

  const handlePosterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onExpand();
  };

  const y = useTransform(scrollProgress, range, ["0%", "-50%"]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-[80%] mx-auto h-[90vh] overflow-hidden relative rounded-2xl"
    >
      <motion.div style={{ y }} className="grid grid-cols-1 gap-4 px-4 py-0">
        {[...posters, ...posters].map((src, i) => (
          <div key={i} onClick={handlePosterClick} className="w-full flex-shrink-0 block cursor-pointer">
            <img src={src} alt={`Poster ${i}`} className="w-full h-auto object-cover rounded-lg shadow-sm" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const FullPostersGrid = ({ onBack }: { onBack: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoster, setSelectedPoster] = useState<number | null>(null);
  const posters = Array.from({ length: 14 }, (_, i) => `/posters/${i + 1}.png`);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    if (selectedPoster === null) return;
    const link = document.createElement('a');
    link.href = posters[selectedPoster];
    link.download = `Poster-${selectedPoster + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-full flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center min-h-[60vh]"
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-black tracking-widest uppercase mb-8"
            >
              DESIGNS
            </motion.h1>
            <div className="w-48 md:w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : selectedPoster !== null ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row gap-8 h-full min-h-[60vh]"
          >
            <div className="flex-1 bg-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center p-8 relative">
              <motion.img 
                key={selectedPoster}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={posters[selectedPoster]} 
                alt={`Poster ${selectedPoster + 1}`} 
                className="max-w-[80%] max-h-[80%] object-contain shadow-xl" 
              />
            </div>
            <div className="w-full lg:w-[400px] flex flex-col justify-center gap-8">
              <div>
                <h2 className="text-5xl font-bold uppercase tracking-tighter mb-4">Poster {selectedPoster + 1}</h2>
                <p className="text-gray-600 leading-relaxed">
                  This design explores the relationship between negative space and typography. Created using a combination of digital tools to achieve a unique texture and depth.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Download Poster
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedPoster(null)}
                    className="flex-1 py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest hover:bg-black/5 transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setSelectedPoster((prev) => (prev! + 1) % posters.length)}
                    className="flex-1 py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest hover:bg-black/5 transition-all active:scale-95"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold uppercase tracking-wide">All Posters</h2>
              <button 
                onClick={onBack}
                className="px-6 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posters.map((src, i) => (
                <motion.div
                  key={i}
                  onClick={() => setSelectedPoster(i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img src={src} alt={`Poster ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                    <span className="text-2xl font-bold">#{i + 1}</span>
                    <span className="text-xs uppercase tracking-widest mt-2">View Details</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FullProjectsGrid = ({ onBack }: { onBack: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const projects = [
    "/website_pics/jalam.png",
    "/website_pics/portfolio.png",
    "/website_pics/profile.png",
    "/website_pics/wedding.png",
    "/website_pics/quiz.png",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-full flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center min-h-[60vh]"
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-black tracking-widest uppercase mb-8"
            >
              PROJECTS
            </motion.h1>
            <div className="w-48 md:w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : selectedProject !== null ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row gap-8 h-full min-h-[60vh]"
          >
            <div className="flex-1 bg-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center p-8 relative">
              <motion.img 
                key={selectedProject}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={projects[selectedProject]} 
                alt={`Project ${selectedProject + 1}`} 
                className="max-w-[90%] max-h-[90%] object-contain shadow-xl" 
              />
            </div>
            <div className="w-full lg:w-[400px] flex flex-col justify-center gap-8">
              <div>
                <h2 className="text-5xl font-bold uppercase tracking-tighter mb-4">Project {selectedProject + 1}</h2>
                <p className="text-gray-600 leading-relaxed">
                  A comprehensive web development project focusing on user experience and performance. Built with modern technologies to ensure scalability and responsiveness.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Visit Website
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest hover:bg-black/5 transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setSelectedProject((prev) => (prev! + 1) % projects.length)}
                    className="flex-1 py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest hover:bg-black/5 transition-all active:scale-95"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold uppercase tracking-wide">All Projects</h2>
              <button 
                onClick={onBack}
                className="px-6 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((src, i) => (
                <motion.div
                  key={i}
                  onClick={() => setSelectedProject(i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img src={src} alt={`Project ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                    <span className="text-2xl font-bold">Project #{i + 1}</span>
                    <span className="text-xs uppercase tracking-widest mt-2">View Details</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};