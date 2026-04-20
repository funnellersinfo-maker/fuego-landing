'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax: image moves slower than text
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] bg-black overflow-hidden"
    >
      {/* ── Fire Background ── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/fire-bg.png"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      </div>

      {/* ── Floating Embers ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-flame"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '0%',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              y: [0, -300 - Math.random() * 400],
              x: [0, (Math.random() - 0.5) * 80],
              opacity: [0, 0.9, 0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* ── Hero Content (sticky viewport) ── */}
      <div className="sticky top-0 h-screen z-10 flex flex-col items-center overflow-hidden">
        {/* Main Hero Image — upper half */}
        <motion.div
          className="relative w-full flex-1 min-h-0 flex items-end justify-center"
          style={{ y: imageY }}
        >
          <Image
            src="/hero-burger.png"
            alt="Premium gourmet burger - FUEGO restaurant"
            fill
            className="object-contain object-bottom"
            priority
            quality={95}
            sizes="100vw"
          />
          {/* Radial glow behind burger */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,rgba(255,69,0,0.15)_0%,transparent_60%)]" />
        </motion.div>

        {/* ── Text Block — below burger, no overlap ── */}
        <motion.div
          className="relative z-20 w-full text-center px-4 pt-2 pb-8 md:pb-12 flex-shrink-0"
          style={{ y: textY, opacity: opacityText }}
        >
          <h1
            className="font-[family-name:var(--font-archivo-black)] uppercase tracking-tighter leading-[0.85]"
          >
            <span className="block text-[2.2rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] text-white/10 select-none">
              PRUEBA EL.
            </span>
            <span className="block text-[3rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8.5rem] text-flame -mt-1 sm:-mt-2 md:-mt-3 drop-shadow-[0_0_30px_rgba(255,69,0,0.5)]">
              FUEGO.
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed px-4"
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

          {/* CTA Button */}
          <motion.div
            className="mt-4 md:mt-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
          >
            <button className="group relative px-5 sm:px-8 py-3 sm:py-4 bg-flame text-white font-[family-name:var(--font-archivo-black)] text-xs sm:text-sm md:text-base uppercase tracking-wider rounded-full neon-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              {/* Glow ring */}
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
  );
}
