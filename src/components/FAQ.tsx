'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: '¿Cuáles son los horarios de FUEGO?',
    answer:
      'Estamos abiertos de lunes a domingo de 11:00 AM a 11:00 PM. La terraza y zona VIP Pool abren a partir de las 12:00 PM. Los viernes y sábados extendemos hasta la medianoche.',
  },
  {
    question: '¿Dónde están ubicados?',
    answer:
      'Estamos en Carrera 43A #10 Sur-50, barrio El Poblado, Medellín. Nuestro restaurante está en un penthouse rooftop con piscina infinity y vista panorámica a toda la ciudad. Fácil acceso en transporte público o Uber.',
  },
  {
    question: '¿Cómo puedo hacer una reserva?',
    answer:
      'Puedes reservar directamente en nuestra sección de "Reservar" aquí en la web, llamándonos al +57 300 000 0000, o por WhatsApp. Recomendamos reservar con al menos 24 horas de anticipación para la zona VIP Pool.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos efectivo, tarjetas Visa, Mastercard y American Express. También recibimos pagos por Nequi, Daviplata y transferencia Bancolombia. ¡Todo para tu comodidad!',
  },
  {
    question: '¿Hacen delivery?',
    answer:
      '¡Sí! Puedes pedir tu comida por PedidosYa, Rappi, o directamente por nuestro WhatsApp +57 300 000 0000. El área de cobertura incluye El Poblado, Laureles, Envigado y Sabaneta.',
  },
  {
    question: '¿Tienen opciones para personas con alérgenos?',
    answer:
      'Sí, informamos sobre los ingredientes de cada plato en nuestro menú. Si tienes alguna alergia o restricción alimentaria, avísale a tu mesero y prepararemos tu plato de forma segura. También tenemos opciones sin gluten y vegetarianas.',
  },
  {
    question: '¿Puedo acceder al rooftop y piscina?',
    answer:
      '¡Claro! Nuestro rooftop con piscina infinity está disponible para todos los clientes del restaurante. La zona VIP Pool es exclusiva y requiere reserva previa. El rooftop es perfecto para eventos privados, cenas románticas y ocasiones especiales con vista a Medellín.',
  },
  {
    question: '¿Realizan eventos privados?',
    answer:
      'Sí, organizamos eventos privados en nuestra terraza y zona VIP Pool. Manejamos cumpleaños, reuniones corporativas, despedidas y más. Contáctanos por WhatsApp o email para cotizaciones personalizadas.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="faq" ref={sectionRef} className="relative py-20 sm:py-28 px-4 sm:px-6 bg-black">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.03)_0%,transparent_50%)]" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-flame text-xs uppercase tracking-[0.3em] font-medium">
            Ayuda
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-archivo-black)] text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none">
            PREGUNTAS{' '}
            <span className="text-flame">FRECUENTES</span>
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Todo lo que necesitas saber sobre FUEGO. Si no encuentras tu
            respuesta, ¡escríbenos por WhatsApp!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-white/10 bg-[#0a0a0a]/60 px-5 sm:px-6 data-[state=open]:border-flame/30 data-[state=open]:bg-flame/[0.03] transition-all duration-300"
              >
                <AccordionTrigger className="text-white text-sm sm:text-base font-medium hover:text-flame hover:no-underline py-5 text-left [&[data-state=open]>svg]:text-flame">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-sm leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
