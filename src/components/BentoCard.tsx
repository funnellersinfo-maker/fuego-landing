'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface BentoCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  delay?: number;
}

export default function BentoCard({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  delay = 0,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer overflow-hidden rounded-3xl md:rounded-4xl bg-[#0a0a0a] border border-white/5"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            quality={90}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Fire glow on hover */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,69,0,0.2)_0%,transparent_60%)]"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          >
            <h3 className="font-[family-name:var(--font-archivo-black)] text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/60 leading-relaxed max-w-[280px]">
              {subtitle}
            </p>
          </motion.div>

          {/* Hover indicator */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-flame text-sm font-semibold uppercase tracking-wider"
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <span>Descubrir</span>
            <span>→</span>
          </motion.div>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl md:rounded-4xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? 'inset 0 0 30px rgba(255, 69, 0, 0.1), 0 0 30px rgba(255, 69, 0, 0.1)'
            : 'inset 0 0 0px rgba(255, 69, 0, 0), 0 0 0px rgba(255, 69, 0, 0)',
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}
