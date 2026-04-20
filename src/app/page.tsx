'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import BurgerAssembly from '@/components/BurgerAssembly';
import BentoCard from '@/components/BentoCard';

const bentoItems = [
  {
    title: 'Carnes',
    subtitle:
      'Cortes premium a la parrilla con fuego real. Cada pieza seleccionada para máxima jugosidad y sabor ahumado incomparable.',
    imageSrc: '/bento-grill.png',
    imageAlt: 'Premium meat grilling on open fire',
    delay: 0,
  },
  {
    title: 'Salsas',
    subtitle:
      'Nuestra salsa secreta, elaborada con ingredientes frescos. El toque perfecto que convierte cada bocado en una experiencia.',
    imageSrc: '/bento-sauce.png',
    imageAlt: 'Secret sauce pouring over crispy fries',
    delay: 0.15,
  },
  {
    title: 'Crujiente',
    subtitle:
      'Pollo frito con el crujiente perfecto. Receta artesanal con un empanizado dorado que redefine cada mordida.',
    imageSrc: '/bento-crunch.png',
    imageAlt: 'Crispy fried chicken close-up',
    delay: 0.3,
  },
];

// ─── Floating Embers ───
function FloatingEmbers() {
  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-5%',
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: i % 3 === 0
              ? 'radial-gradient(circle, #FFD700, #FF8C00)'
              : 'radial-gradient(circle, #FF4500, #FF6B35)',
          }}
          animate={{
            y: [0, -400 - Math.random() * 500],
            x: [0, (Math.random() - 0.5) * 120],
            opacity: [0, 0.8, 0.4, 0],
            scale: [1, 1.2, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const bentoRef = useRef<HTMLDivElement>(null);
  const bentoInView = useInView(bentoRef, { once: true, margin: '-80px' });

  // ── Hero scroll ──
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(heroScroll, [0, 0.7], ['0%', '40%']);
  const textOpacity = useTransform(heroScroll, [0, 0.55], [1, 0]);
  const smoothTextY = useSpring(textY, { stiffness: 50, damping: 20 });

  // ── Background scroll ──
  const bgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bgScroll } = useScroll({
    target: bgRef,
    offset: ['start start', 'end end'],
  });

  const bgScale = useTransform(bgScroll, [0, 0.4, 0.8], [1, 0.85, 0.7]);
  const bgOpacity = useTransform(bgScroll, [0, 0.5, 0.9], [0.4, 0.25, 0.1]);

  return (
    <div ref={bgRef} className="relative bg-black min-h-screen">

      {/* ═══ CSS Fire Background ═══ */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        {/* Animated fire gradient */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 50% 100%, rgba(255,69,0,0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(255,140,0,0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 85%, rgba(255,69,0,0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 120%, rgba(139,0,0,0.2) 0%, transparent 60%),
            linear-gradient(to top, #0a0000 0%, #000000 40%)
          `,
        }} />

        {/* Animated fire waves */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[40vh]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            background: `
              radial-gradient(ellipse at 30% 100%, rgba(255,69,0,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 100%, rgba(255,140,0,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 90%, rgba(255,215,0,0.05) 0%, transparent 40%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      </motion.div>

      <FloatingEmbers />

      {/* ═══ Page Content ═══ */}
      <div className="relative z-10">

        {/* ═══ HERO ═══ */}
        <section
          ref={heroRef}
          className="relative min-h-[250vh] sm:min-h-[300vh]"
        >
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-2 sm:gap-4 overflow-hidden">

            {/* Burger Assembly */}
            <div className="flex-shrink-0 mt-[-5vh] sm:mt-[-8vh]">
              <BurgerAssembly scrollYProgress={heroScroll} />
            </div>

            {/* Hero Text */}
            <motion.div
              className="relative w-full text-center px-4 flex-shrink-0"
              style={{ y: smoothTextY, opacity: textOpacity }}
            >
              <h1 className="font-[family-name:var(--font-archivo-black)] uppercase tracking-tighter leading-[0.85]">
                <span className="block text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] text-white/10 select-none">
                  PRUEBA EL.
                </span>
                <span className="block text-[4rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] text-flame -mt-4 sm:-mt-8 md:-mt-10 lg:-mt-14 drop-shadow-[0_0_30px_rgba(255,69,0,0.5)]">
                  FUEGO.
                </span>
              </h1>

              <motion.p
                className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                No hacemos comida rápida. Hacemos comida real, rápido.
                <br className="hidden sm:block" />
                <span className="text-gold font-medium">
                  Ingredientes de origen, sabor legendario.
                </span>
              </motion.p>

              <motion.div
                className="mt-6 md:mt-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
              >
                <button className="group relative px-5 sm:px-8 py-3 sm:py-4 bg-flame text-white font-[family-name:var(--font-archivo-black)] text-xs sm:text-sm md:text-base uppercase tracking-wider rounded-full neon-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                  <span className="absolute inset-0 rounded-full bg-flame/20 blur-xl group-hover:bg-flame/30 transition-colors duration-300" />
                  <span className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:border-gold/60 transition-colors duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    PEDIR AHORA
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══ BENTO GRID ═══ */}
        <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-16">
          <div ref={bentoRef} className="text-center mb-12 sm:mb-16 md:mb-20">
            <motion.p
              className="text-flame text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Lo que nos define
            </motion.p>
            <motion.h2
              className="font-[family-name:var(--font-archivo-black)] text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={bentoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Bento de{' '}
              <span className="text-flame drop-shadow-[0_0_15px_rgba(255,69,0,0.4)]">
                Sabor
              </span>
            </motion.h2>
            <motion.p
              className="mt-4 text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={bentoInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Cada detalle cuenta. Desde la selección del corte hasta el último toque
              de salsa, todo está pensado para que sientas el fuego.
            </motion.p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {bentoItems.map((item) => (
              <BentoCard
                key={item.title}
                title={item.title}
                subtitle={item.subtitle}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
                delay={item.delay}
              />
            ))}
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-white/10 py-10 px-6 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-[family-name:var(--font-archivo-black)] text-xl sm:text-2xl text-white uppercase tracking-tight">
              FUEGO<span className="text-flame">.</span>
            </p>
            <p className="text-xs sm:text-sm text-white/40">
              Comida real, rápido. &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
