'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Instagram } from 'lucide-react';

const INFO_CARDS = [
  {
    icon: Clock,
    title: 'Horario',
    lines: ['Lun - Dom', '11:00 AM - 11:00 PM'],
  },
  {
    icon: Phone,
    title: 'Teléfono',
    lines: ['+57 300 000 0000'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['hola@fuegomedellin.com'],
  },
  {
    icon: Instagram,
    title: 'Redes Sociales',
    lines: ['@fuegomedellin', 'TikTok: @fuegomedellin'],
  },
];

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="ubicacion"
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-flame text-xs uppercase tracking-[0.3em] font-medium">
            Visítanos
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-archivo-black)] text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none">
            ENCUÉNTRANOS{' '}
            <span className="text-flame">EN POBLADO</span>
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Estamos en el corazón de El Poblado, Medellín. Ven y vive la
            experiencia FUEGO con vista a la ciudad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 aspect-video sm:aspect-auto sm:h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d-75.5654!3d6.2108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb7b5d1a1%3A0x5c2c4e4d1a5b7c9!2sParque%20Lleras%2C%20Medell%C3%ADn!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación FUEGO en El Poblado, Medellín"
            />
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {INFO_CARDS.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5 transition-all duration-300 hover:border-flame/20"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-flame/10">
                  <card.icon className="h-5 w-5 text-flame" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-archivo-black)] text-xs uppercase tracking-wider text-white/70 mb-1">
                    {card.title}
                  </h3>
                  {card.lines.map((line) => (
                    <p key={line} className="text-sm text-white font-medium">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Address card */}
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5 col-span-2 lg:col-span-1 transition-all duration-300 hover:border-flame/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-flame/10">
                <MapPin className="h-5 w-5 text-flame" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-archivo-black)] text-xs uppercase tracking-wider text-white/70 mb-1">
                  Dirección
                </h3>
                <p className="text-sm text-white font-medium">
                  Cra 43A #10 Sur-50
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  El Poblado, Medellín, Colombia
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
