'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VIDEO_DURATION = 8; // seconds

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Text parallax
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Scroll-driven video scrubbing
  const updateVideoFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const progress = scrollYProgress.get();
    const targetTime = progress * VIDEO_DURATION;

    // Only seek if the difference is significant (avoid stuttering)
    if (Math.abs(video.currentTime - targetTime) > 1 / 30) {
      video.currentTime = targetTime;
    }
  }, [scrollYProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Preload video fully before enabling scrubbing
    video.preload = 'auto';

    const unsubscribe = scrollYProgress.on('change', () => {
      requestAnimationFrame(updateVideoFrame);
    });

    return () => {
      unsubscribe();
    };
  }, [scrollYProgress, updateVideoFrame]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] sm:min-h-[250vh] bg-black overflow-hidden"
    >
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full z-10 flex flex-col items-center justify-center overflow-hidden">

        {/* ── Video Background ── */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="/hero-video.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-contain"
            style={{ filter: 'brightness(0.7) contrast(1.1)' }}
          />

          {/* Gradient overlays for text readability — no visual noise */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* ── Floating Embers ── */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-flame"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '0%',
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
              animate={{
                y: [0, -300 - Math.random() * 400],
                x: [0, (Math.random() - 0.5) * 80],
                opacity: [0, 0.7, 0.2, 0],
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

        {/* ── Hero Text ── */}
        <motion.div
          className="relative z-20 w-full text-center px-4"
          style={{ y: textY, opacity: opacityText }}
        >
          <h1 className="font-[family-name:var(--font-archivo-black)] uppercase tracking-tighter leading-[0.85]">
            <span className="block text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] text-white/10 select-none">
              PRUEBA EL.
            </span>
            <span className="block text-[4rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] text-flame -mt-4 sm:-mt-8 md:-mt-10 lg:-mt-14 drop-shadow-[0_0_30px_rgba(255,69,0,0.5)]">
              FUEGO.
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed px-4"
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
  );
}
