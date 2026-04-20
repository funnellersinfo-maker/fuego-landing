'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VIDEO_DURATION = 8;

export default function VideoBackground({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track total page scroll
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // Video scrub: drive video frame from total page scroll
  const updateVideoFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const progress = scrollYProgress.get();
    const targetTime = progress * VIDEO_DURATION;

    if (Math.abs(video.currentTime - targetTime) > 1 / 30) {
      video.currentTime = targetTime;
    }
  }, [scrollYProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.preload = 'auto';

    const unsub = scrollYProgress.on('change', () => {
      requestAnimationFrame(updateVideoFrame);
    });
    return () => { unsub(); };
  }, [scrollYProgress, updateVideoFrame]);

  // Video compression: scale down as user scrolls
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.75, 0.55]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 0.85, 0.5]);

  // Dark overlay that increases as you scroll (for readability over video)
  const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0.3, 0.75]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* ═══ Fixed Video Background ═══ */}
      <motion.div
        className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.9) contrast(1.05) saturate(1.2)' }}
        />
      </motion.div>

      {/* ═══ Adaptive Dark Overlay ═══ */}
      <motion.div
        className="fixed inset-0 z-[1] bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* ═══ Floating Embers ═══ */}
      <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
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
              opacity: [0, 0.6, 0.15, 0],
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

      {/* ═══ Page Content (scrolls over video) ═══ */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
