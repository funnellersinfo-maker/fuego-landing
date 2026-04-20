'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
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

  return (
    <main className="bg-black min-h-screen">
      {/* ════════════════════════════════════════════
          HERO SECTION — The Indulgence
          ════════════════════════════════════════════ */}
      <HeroSection />

      {/* ════════════════════════════════════════════
          BENTO GRID — Bento Grid de Sabor
          ════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Section title */}
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
            className="mt-4 text-sm sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={bentoInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Cada detalle cuenta. Desde la selección del corte hasta el último toque
            de salsa, todo está pensado para que sientas el fuego.
          </motion.p>
        </div>

        {/* Bento Cards Grid */}
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
      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-archivo-black)] text-xl sm:text-2xl text-white uppercase tracking-tight">
            FUEGO<span className="text-flame">.</span>
          </p>
          <p className="text-xs sm:text-sm text-white/30">
            Comida real, rápido. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
