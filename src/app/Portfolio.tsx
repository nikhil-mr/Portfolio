'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useTransform, MotionValue, useSpring, useVelocity, useAnimationFrame } from 'framer-motion';
import { ChevronRight, X, Mail, Phone } from 'lucide-react';
import AboutPage from './AboutPage';

const CursorContext = React.createContext<{
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
}>({
  cursorVariant: "default",
  setCursorVariant: () => {},
});

const useCursor = () => React.useContext(CursorContext);

export default function Portfolio() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [showAbout, setShowAbout] = useState(false);

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white cursor-none [&_*]:cursor-none">
        <Cursor />
        <AnimatePresence mode="wait">
          {!isIntroComplete ? (
            <IntroAnimation key="intro" onComplete={() => setIsIntroComplete(true)} />
          ) : showAbout ? (
            <AboutPage key="about" onBack={() => setShowAbout(false)} />
          ) : (
            <HomePage key="home" onOpenAbout={() => setShowAbout(true)} />
          )}
        </AnimatePresence>
      </div>
    </CursorContext.Provider>
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

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const sensitivity = 0.003;
      const current = scrollProgress.get();
      const newProgress = current + deltaY * sensitivity;

      if (newProgress >= 1.1) {
         onComplete();
      } else {
        scrollProgress.set(Math.max(0, newProgress));
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLoaded, scrollProgress, onComplete]);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (latest < 0.33) setCurrentText("DEVELOPER");
    else if (latest < 0.66) setCurrentText("DESIGNER");
    else setCurrentText("GAMER");
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden touch-none"
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

const TransitionOverlay = ({ label, onComplete }: { label: string; onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
    >
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold text-black tracking-widest uppercase mb-8"
      >
        {label}
      </motion.h1>
      <div className="w-48 md:w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </div>
    </motion.div>
  );
};

const CharacterTypingEffect = ({ text, delay }: { text: string; delay: number }) => {
  const characters = text.split("");
  return (
    <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed">
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

const ConnectText = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const texts = ["LET'S CONNECT", "AND EXPLORE"];
    const currentFullText = texts[textIndex];
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 1500;

    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex]);

  return (
    <motion.h2
      className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-black uppercase"
    >
      <span>{displayedText}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          times: [0, 0.5, 0.5, 1],
          ease: "linear",
        }}
        className="inline-block w-0.5 h-12 md:h-24 lg:h-32 bg-black ml-2 align-middle -translate-y-4"
      />
    </motion.h2>
  );
};

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const MarqueeStrip = ({ direction = "left", className }: { direction?: "left" | "right"; className?: string }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    let moveBy = directionFactor.current * (direction === "left" ? -2 : 2) * (delta / 1000);
    moveBy += moveBy * Math.abs(velocityFactor.get());

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`absolute w-[120%] bg-purple-500 py-6 flex items-center overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap gap-12"
        style={{ x }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-black text-2xl md:text-4xl font-bold uppercase tracking-widest flex items-center gap-4">
            DEVELOPER 
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <StarIcon className="text-white w-8 h-8 md:w-12 md:h-12" strokeWidth={3} />
            </motion.div>
            DESIGNER 
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <StarIcon className="text-white w-8 h-8 md:w-12 md:h-12" strokeWidth={3} />
            </motion.div>
            GAMER 
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <StarIcon className="text-white w-8 h-8 md:w-12 md:h-12" strokeWidth={3} />
            </motion.div>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const StarIcon = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5 text-gray-400"}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <line x1="1" y1="12" x2="23" y2="12"></line> 
    <line x1="4.22" y1="4.22" x2="19.78" y2="19.78"></line>
    <line x1="4.22" y1="19.78" x2="19.78" y2="4.22"></line>
  </svg>
);

const MagneticButton = ({ children, href, onClick, style, className }: { children: React.ReactNode; href?: string; onClick?: () => void; style?: any; className?: string }) => {
  const ref = useRef<HTMLElement>(null);
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

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref as any}
      href={href}
      onClick={onClick}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className || "relative flex items-center gap-4 px-8 py-4 md:px-12 md:py-6 bg-white text-black rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-colors duration-300"}
    >
      {children}
    </Component>
  );
};

const HomePage = ({ onOpenAbout }: { onOpenAbout: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollY } = useScroll();
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start start", "end end"],
  });

  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!hasAutoScrolled && latest > 0 && latest < window.innerHeight) {
      setHasAutoScrolled(true);
      aboutRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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

  const statsBg = useTransform(statsProgress, [0.8, 1], ["#FFFFFF", "#000000"]);
  const statsTextColor = useTransform(statsProgress, [0.8, 1], ["#000000", "#FFFFFF"]);

  const rightOpacity = useTransform(statsProgress, [0.05, 0.2], [0, 1]);
  const rightY = useTransform(statsProgress, [0.05, 0.2, 1], [20, 0, -50]);

  const stripRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stripProgress } = useScroll({
    target: stripRef,
    offset: ["start end", "end start"],
  });
  const stripY = useTransform(stripProgress, [0, 1], [-100, 0]);

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

  const [transitionData, setTransitionData] = useState<{ label: string; targetRef: React.RefObject<HTMLDivElement | null>; callback?: () => void } | null>(null);

  const handleNavigate = (section: string) => {
    let ref = containerRef;
    let label = section;
    let callback: (() => void) | undefined;

    switch (section.toLowerCase()) {
      case 'home':
        ref = containerRef;
        label = "HOME";
        break;
      case 'about':
        ref = aboutRef;
        label = "ABOUT";
        break;
      case 'works':
        ref = statsRef;
        label = "WORKS";
        callback = () => {
          setShowPostersGrid(false);
          setShowProjectsGrid(false);
        };
        break;
      case 'posters':
        ref = statsRef;
        label = "POSTERS";
        callback = () => setShowPostersGrid(true);
        break;
      case 'websites':
        ref = statsRef;
        label = "WEBSITES";
        callback = () => setShowProjectsGrid(true);
        break;
      case 'contact':
        ref = contactRef;
        label = "CONTACT";
        break;
    }

    setTransitionData({ label, targetRef: ref, callback });
  };

  useEffect(() => {
    if (showPostersGrid || showProjectsGrid) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showPostersGrid, showProjectsGrid]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      <AnimatePresence>
        {transitionData && (
          <TransitionOverlay label={transitionData.label} onComplete={() => { transitionData.callback?.(); transitionData.targetRef.current?.scrollIntoView({ behavior: "instant" }); setTimeout(() => setTransitionData(null), 100); }} />
        )}
      </AnimatePresence>

      {/* Scroll Interaction Section */}
      <div ref={containerRef} className="h-[300vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
          {/* Left Zone - White Background */}
          <div className="w-full md:w-1/2 h-[45%] md:h-full bg-white flex flex-col justify-center items-center relative p-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full md:w-[200%] flex justify-start z-50">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="text-6xl md:text-[10vw] font-bold tracking-tighter text-black uppercase text-left leading-[0.8]"
              >
                Digital Designer<br />& Developer
              </motion.h1>
            </div>

            <div className="flex flex-col items-start gap-1 z-10 max-w-md mt-40 md:mt-20 self-start md:self-center">
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
              className="absolute bottom-12 hidden md:flex flex-col items-center gap-3 z-20"
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
          <div className="w-full md:w-1/2 h-[55%] md:h-full relative overflow-hidden">
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
            <nav className="absolute bottom-20 md:bottom-8 right-8 flex flex-col items-end gap-4 z-40 text-white">
              <div className="flex flex-col items-end gap-4">
                <FlipLink onClick={() => handleNavigate('About')}>About</FlipLink>
                <FlipLink onClick={() => handleNavigate('Works')}>Works</FlipLink>
                <FlipLink onClick={() => handleNavigate('Contact')}>Contact</FlipLink>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* About Section */}
      <motion.div ref={aboutRef} style={{ backgroundColor: aboutBg }} className="relative h-[250vh] z-20">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-4 md:p-20 gap-12">
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
          <MagneticButton
            onClick={onOpenAbout}
            style={{ opacity: useTransform(aboutProgress, [0.7, 0.8], [0, 1]) }}
            className="px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            About Me
          </MagneticButton>
        </div>
      </motion.div>

      {/* Stats / Philosophy Section */}
      <motion.div 
        ref={statsRef}
        style={{ backgroundColor: statsBg, color: statsTextColor }}
        className="rounded-t-[80px] md:rounded-t-[120px] z-30 relative h-[450vh]"
      >
        <div className="sticky top-0 h-screen flex flex-col md:flex-row justify-between items-start p-4 md:p-20 gap-12">
          <div className="flex flex-col gap-8 max-w-xl">
            <motion.p 
              style={{ opacity: textOpacity, y: textY }}
              className="text-lg md:text-xl leading-relaxed"
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

            </div>
          </div>
          <motion.div 
            style={{ opacity: rightOpacity, y: rightY }}
            className="flex flex-col gap-8 max-w-2xl w-full"
          >
            <AnimatePresence mode="wait">
              {activeSection === 'posters' && (
                <PosterGallery key="posters" onExpand={() => setShowPostersGrid(true)} scrollProgress={statsProgress} range={[0.2, 0.5]} />
              )}
              {activeSection === 'projects' && (
                <ProjectGallery key="projects" onExpand={() => setShowProjectsGrid(true)} scrollProgress={statsProgress} range={[0.55, 0.85]} />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPostersGrid && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto cursor-none [&_*]:cursor-none"
          >
            <FullPostersGrid onBack={() => setShowPostersGrid(false)} />
          </motion.div>
        )}
        {showProjectsGrid && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto cursor-none [&_*]:cursor-none"
          >
            <FullProjectsGrid onBack={() => setShowProjectsGrid(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crossing Strips Section */}
      <motion.div 
        ref={stripRef}
        style={{ y: stripY }}
        animate={{ x: showPostersGrid || showProjectsGrid ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-[30vh] -mt-32 -mb-[20vh] overflow-hidden flex items-center justify-center z-40"
      >
        <MarqueeStrip direction="left" className="rotate-6 z-10" />
        <MarqueeStrip direction="right" className="-rotate-6 z-20" />
      </motion.div>

      {/* Contact Section */}
      <div ref={contactRef} className="relative min-h-screen flex flex-col justify-between pt-20 pb-10 px-6 md:px-12 bg-black overflow-hidden z-30">
        <div className="relative z-10 w-full max-w-6xl flex flex-row justify-start gap-8 mb-20 px-4 mt-auto">
          <div className="flex flex-col gap-6">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Links</h3>
            <div className="flex flex-col gap-2">
              {['Home', 'About', 'Works', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleNavigate(item)}
                  className="text-lg font-thin text-white uppercase tracking-widest hover:text-purple-500 transition-colors text-left w-fit"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Socials</h3>
            <div className="flex flex-col gap-2">
              <a href="mailto:12nikhilreji@email.com" className="text-lg font-thin text-white uppercase tracking-widest hover:text-purple-500 transition-colors w-fit">Email</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-lg font-thin text-white uppercase tracking-widest hover:text-purple-500 transition-colors w-fit">LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-lg font-thin text-white uppercase tracking-widest hover:text-purple-500 transition-colors w-fit">GitHub</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-lg font-thin text-white uppercase tracking-widest hover:text-purple-500 transition-colors w-fit">whatsapp</a>
            </div>
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
  const { setCursorVariant } = useCursor();
  const step = (range[1] - range[0]) / total;
  const start = range[0] + index * step;
  
  const opacity = useTransform(scrollProgress, [start, start + step * 0.6], [0, 1]);
  const y = useTransform(scrollProgress, [start, start + step * 0.6], [50, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      onClick={onExpand}
      onMouseEnter={() => setCursorVariant("gallery")}
      onMouseLeave={() => setCursorVariant("default")}
      className="w-full flex-shrink-0 block cursor-pointer bg-zinc-100 p-6 md:p-8 rounded-lg shadow-sm hover:bg-zinc-200 transition-colors group"
    >
      <h3 className="text-2xl md:text-4xl font-bold text-black uppercase mb-2 group-hover:text-purple-600 transition-colors">
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
    { id: 1, name: "Jalam", tools: ["HTML", "CSS", "JavaScript","Firebase"] },
    { id: 2, name: "portfolio_V2", tools: ["TypeScript", "Tailwind CSS"] },
    { id: 3, name: "portfolio", tools: ["HTML", "CSS", "JavaScript"] },
    { id: 4, name: "Wedding", tools: ["HTML", "CSS", "JavaScript","PHP"] },
    { id: 5, name: "Quiz App", tools: ["TypeScript", "Tailwind CSS"] },
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

const FlipLink = ({ children, onClick }: { children: string; onClick: () => void }) => {
  const DURATION = 0.25;
  const STAGGER = 0.025;

  return (
    <motion.button
      initial="initial"
      whileHover="hovered"
      onClick={onClick}
      className="relative block overflow-hidden whitespace-nowrap text-2xl font-bold uppercase md:text-4xl text-right"
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
    </motion.button>
  );
};

const Cursor = () => {
  const { cursorVariant } = useCursor();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const variants = {
    default: {
      scale: 1,
    },
    gallery: {
      scale: 1.3,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div 
        variants={variants}
        animate={cursorVariant}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          <path
            d="M0 0 L12 0 L12 5 L5 5 L5 6 L6 6 L6 7 L7 7 L7 8 L8 8 L8 9 L9 9 L9 10 L10 10 L10 11 L11 11 L11 12 L12 12 L12 13 L13 13 L13 14 L14 14 L14 15 L15 15 L15 16 L16 16 L16 17 L17 17 L17 18 L14 18 L14 17 L13 17 L13 16 L12 16 L12 15 L11 15 L11 14 L10 14 L10 13 L9 13 L9 12 L8 12 L8 11 L7 11 L7 10 L6 10 L6 9 L5 9 L5 8 L4 8 L4 7 L3 7 L3 6 L2 6 L2 5 L0 5 Z"
            fill="white"
          />
        </svg>
      </motion.div>
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
  const { setCursorVariant } = useCursor();
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

  const move = useTransform(scrollProgress, range, ["0%", "-50%"]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full md:w-[80%] mx-auto h-[90vh] overflow-hidden relative rounded-2xl"
    >
      {/* Mobile: Horizontal movement */}
      <motion.div style={{ x: move }} className="flex md:hidden gap-4 px-4 py-0 w-max">
        {[...posters, ...posters].map((src, i) => (
          <div 
            key={i} 
            onClick={handlePosterClick} 
            onMouseEnter={() => setCursorVariant("gallery")}
            onMouseLeave={() => setCursorVariant("default")}
            className="w-[45vw] flex-shrink-0 block cursor-pointer"
          >
            <img src={src} alt={`Poster ${i}`} className="w-full h-auto object-cover rounded-lg shadow-sm" />
          </div>
        ))}
      </motion.div>

      {/* Desktop: Vertical movement */}
      <motion.div style={{ y: move }} className="hidden md:grid grid-cols-1 gap-4 px-4 py-0">
        {[...posters, ...posters].map((src, i) => (
          <div 
            key={i} 
            onClick={handlePosterClick} 
            onMouseEnter={() => setCursorVariant("gallery")}
            onMouseLeave={() => setCursorVariant("default")}
            className="w-full flex-shrink-0 block cursor-pointer"
          >
            <img src={src} alt={`Poster ${i}`} className="w-full h-auto object-cover rounded-lg shadow-sm" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const FullPostersGrid = ({ onBack }: { onBack: () => void }) => {
  const { setCursorVariant } = useCursor();
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
    <div className="w-full min-h-screen bg-white flex flex-col">
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
            className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-full min-h-[60vh]"
          >
            <div className="flex-1 bg-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center p-4 md:p-8 relative">
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
            className="flex flex-col gap-8 p-8 md:p-12"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold uppercase tracking-wide">All Posters</h2>
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-8 h-8 text-black" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {posters.map((src, i) => (
                <motion.div
                  key={i}
                  onClick={() => setSelectedPoster(i)}
                  onMouseEnter={() => setCursorVariant("gallery")}
                  onMouseLeave={() => setCursorVariant("default")}
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
  const { setCursorVariant } = useCursor();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const projects = [
    "/website_pics/jalam.png",
    "/website_pics/portfolio.png",
    "/website_pics/portfolio_V2.png",
    "/website_pics/wedding.png",
    "/website_pics/quiz.png",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
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
            className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-full min-h-[60vh]"
          >
            <div className="flex-1 bg-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center p-4 md:p-8 relative">
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
            className="flex flex-col gap-8 p-8 md:p-12"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold uppercase tracking-wide">All Projects</h2>
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-8 h-8 text-black" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((src, i) => (
                <motion.div
                  key={i}
                  onClick={() => setSelectedProject(i)}
                  onMouseEnter={() => setCursorVariant("gallery")}
                  onMouseLeave={() => setCursorVariant("default")}
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