'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import MenuSection from '@/components/MenuSection';
import ReservationForm from '@/components/ReservationForm';
import FAQ from '@/components/FAQ';
import MapSection from '@/components/MapSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Force play on mount
    const play = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    // Try immediately
    play();
    // Also try on loadeddata
    video.addEventListener('loadeddata', play);
    // Also try on canplay
    video.addEventListener('canplay', play);
    return () => {
      video.removeEventListener('loadeddata', play);
      video.removeEventListener('canplay', play);
    };
  }, []);

  return (
    <>
      <main className="relative bg-black min-h-screen overflow-hidden">
        {/* ═══ Video Background — Burger spinning ═══ */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              transform: 'translate(-50%, -50%)',
              objectFit: 'cover',
              filter: 'brightness(0.55) contrast(1.15) saturate(1.3)',
            }}
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Dark vignette — pushes focus to center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.85)_100%)]" />

          {/* Top & bottom gradient for text breathing room */}
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-black/90 to-transparent" />
        </div>

        {/* ═══ Hero Content ═══ */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 sm:px-10">
          <div className="max-w-4xl w-full text-center">

            {/* Overlapping Title */}
            <motion.h1
              className="font-[family-name:var(--font-archivo-black)] uppercase tracking-tighter leading-[0.85]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className="block text-[3.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] text-white/[0.18] select-none">
                PRUEBA EL.
              </span>
              <span className="block text-[4.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem] text-flame -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16 drop-shadow-[0_0_40px_rgba(255,69,0,0.6)]">
                FUEGO.
              </span>
            </motion.h1>

            {/* Subtitle — max 2 lines */}
            <motion.p
              className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-md sm:max-w-lg mx-auto leading-snug"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              No hacemos comida rápida. Hacemos comida real, rápido.
              <span className="text-gold font-medium"> Ingredientes de origen, sabor legendario.</span>
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-8 sm:mt-10 md:mt-12"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.7, type: 'spring' }}
            >
              <button className="group relative px-7 sm:px-10 py-4 sm:py-5 bg-flame text-white font-[family-name:var(--font-archivo-black)] text-sm sm:text-base md:text-lg uppercase tracking-wider rounded-full neon-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                <span className="absolute inset-0 rounded-full bg-flame/20 blur-xl group-hover:bg-flame/40 transition-colors duration-300" />
                <span className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:border-gold/60 transition-colors duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  PEDIR AHORA
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* ═══ MENU SECTION ═══ */}
        <MenuSection />

        {/* ═══ RESERVATION SECTION ═══ */}
        <ReservationForm />

        {/* ═══ FAQ SECTION ═══ */}
        <FAQ />

        {/* ═══ MAP / LOCATION SECTION ═══ */}
        <MapSection />

        {/* ═══ FOOTER ═══ */}
        <Footer />
      </main>

      {/* ═══ FLOATING ELEMENTS ═══ */}
      <WhatsAppButton />
      <ChatWidget />
    </>
  );
}
