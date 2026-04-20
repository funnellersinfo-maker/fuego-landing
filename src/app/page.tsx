'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import VideoBackground from '@/components/VideoBackground';
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

export default function Home() {
  const bentoRef = useRef<HTMLDivElement>(null);
  const bentoInView = useInView(bentoRef, { once: true, margin: '-80px' });

  // Hero text parallax (local to hero section)
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(heroScroll, [0, 1], ['0%', '50%']);
  const textOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  return (
    <VideoBackground>
      {/* ════════════════════════════════════════════
          HERO SECTION — The Indulgence
          ════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[200vh] sm:min-h-[250vh]"
      >
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.div
            className="relative z-20 w-full text-center px-4"
            style={{ y: textY, opacity: textOpacity }}
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
              className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed px-4"
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
              className="mt-8 md:mt-10"
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

      {/* ════════════════════════════════════════════
          BENTO GRID — Bento Grid de Sabor
          ════════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════════
          FOOTER — Minimal
          ════════════════════════════════════════════ */}
      <footer className="border-t border-white/10 py-10 px-6 text-center bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-archivo-black)] text-xl sm:text-2xl text-white uppercase tracking-tight">
            FUEGO<span className="text-flame">.</span>
          </p>
          <p className="text-xs sm:text-sm text-white/40">
            Comida real, rápido. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </VideoBackground>
  );
}
