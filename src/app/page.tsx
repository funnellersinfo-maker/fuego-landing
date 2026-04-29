'use client';

import { motion } from 'framer-motion';
import MenuSection from '@/components/MenuSection';
import ReservationForm from '@/components/ReservationForm';
import FAQ from '@/components/FAQ';
import MapSection from '@/components/MapSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatWidget from '@/components/ChatWidget';
import ParticleField from '@/components/ParticleField';

export default function Home() {
  return (
    <>
      {/* ═══ HERO — Video BG as body-level element ═══ */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'url(/hero-bg.mp4) center/cover no-repeat',
        }}
      />
      {/* Fallback: if video-as-bg doesn't work, show poster image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/hero-poster.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'brightness(0.4) contrast(1.2) saturate(1.3)',
        }}
      />
      {/* Real video layer on top of poster */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4) contrast(1.2) saturate(1.3)' }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ═══ PARTICLE FIELD — Embers, smoke & sparks ═══ */}
      <ParticleField />

      <main className="relative z-10 bg-transparent min-h-screen">
        {/* Vignette + gradients over hero */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
        <div className="fixed inset-x-0 top-0 z-0 h-[25%] bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none" />
        <div className="fixed inset-x-0 bottom-0 z-0 h-[20%] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* ═══ Hero Content ═══ */}
        <div className="relative flex items-center justify-center min-h-screen px-6 sm:px-10">
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

        {/* ═══ MENU SECTION — Papas video background ═══ */}
        <div className="relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) contrast(1.1) saturate(1.2)' }}
          >
            <source src="/papas.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
          <MenuSection />
        </div>

        {/* ═══ RESERVATION SECTION ═══ */}
        <ReservationForm />

        {/* ═══ FAQ SECTION — Queso video background ═══ */}
        <div className="relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) contrast(1.1) saturate(1.2)' }}
          >
            <source src="/queso.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
          <FAQ />
        </div>

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
