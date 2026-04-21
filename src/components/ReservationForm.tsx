'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CalendarDays, Clock, Users, Mail, Phone, User, Send } from 'lucide-react';

const AREAS = [
  {
    value: 'terraza',
    label: 'Terraza',
    description: 'Espacio al aire libre con vista panorámica',
  },
  {
    value: 'interior',
    label: 'Interior',
    description: 'Ambiente climatizado y acogedor',
  },
  {
    value: 'vip-pool',
    label: 'VIP Pool',
    description: 'Penthouse con piscina infinity y zona exclusiva',
  },
];

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: '2',
    area: 'terraza',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.email ||
      !formData.telefono ||
      !formData.fecha ||
      !formData.hora
    ) {
      toast.error('Por favor completa todos los campos obligatorios', {
        description: 'Nombre, email, teléfono, fecha y hora son requeridos.',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast.success('¡Reserva confirmada! 🔥', {
      description: `Hola ${formData.nombre}, tu reserva para ${formData.personas} personas en ${AREAS.find(a => a.value === formData.area)?.label} el ${formData.fecha} a las ${formData.hora} ha sido registrada. Te enviaremos un correo de confirmación a ${formData.email}.`,
      duration: 6000,
    });

    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      fecha: '',
      hora: '',
      personas: '2',
      area: 'terraza',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section
      id="reservas"
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/rooftop-medellin.png')" }}
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-flame text-xs uppercase tracking-[0.3em] font-medium">
            Exclusivo
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-archivo-black)] text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none">
            RESERVA TU{' '}
            <span className="text-flame">EXPERIENCIA</span>
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Vive la experiencia FUEGO en nuestro penthouse rooftop con piscina
            infinity y vista espectacular a Medellín. Reserva tu mesa en la
            terraza, interior o zona VIP Pool.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-6 sm:p-8 space-y-6"
        >
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="nombre"
                className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <User className="h-3.5 w-3.5 text-flame" />
                Nombre *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:border-flame focus-visible:ring-flame/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Mail className="h-3.5 w-3.5 text-flame" />
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:border-flame focus-visible:ring-flame/20"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="telefono"
              className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Phone className="h-3.5 w-3.5 text-flame" />
              Teléfono *
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+57 300 000 0000"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:border-flame focus-visible:ring-flame/20"
              required
            />
          </div>

          {/* Date, Time & People Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="fecha"
                className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <CalendarDays className="h-3.5 w-3.5 text-flame" />
                Fecha *
              </Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                min={today}
                value={formData.fecha}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:border-flame focus-visible:ring-flame/20 [color-scheme:dark]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="hora"
                className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Clock className="h-3.5 w-3.5 text-flame" />
                Hora *
              </Label>
              <Input
                id="hora"
                name="hora"
                type="time"
                value={formData.hora}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:border-flame focus-visible:ring-flame/20 [color-scheme:dark]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="personas"
                className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Users className="h-3.5 w-3.5 text-flame" />
                Personas
              </Label>
              <select
                id="personas"
                name="personas"
                value={formData.personas}
                onChange={handleChange}
                className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white focus-visible:border-flame focus-visible:ring-flame/20 outline-none transition-[color,box-shadow] [color-scheme:dark]"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} className="bg-[#0a0a0a]">
                    {n} {n === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area Selection */}
          <div className="space-y-3">
            <Label className="text-white/70 text-xs uppercase tracking-wider">
              Área de Preferencia
            </Label>
            <RadioGroup
              value={formData.area}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, area: value }))
              }
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {AREAS.map((area) => (
                <label
                  key={area.value}
                  className={`relative flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                    formData.area === area.value
                      ? 'border-flame bg-flame/10 shadow-[0_0_20px_rgba(255,69,0,0.15)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <RadioGroupItem
                    value={area.value}
                    className="border-white/20 text-flame"
                  />
                  <div>
                    <span
                      className={`text-sm font-semibold ${
                        formData.area === area.value
                          ? 'text-flame'
                          : 'text-white'
                      }`}
                    >
                      {area.label}
                    </span>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      {area.description}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-flame hover:bg-flame/80 text-white font-[family-name:var(--font-archivo-black)] text-sm uppercase tracking-wider rounded-xl neon-glow transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,69,0,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                🔥
              </motion.span>
            ) : (
              <span className="flex items-center gap-2">
                RESERVAR AHORA
                <Send className="h-4 w-4" />
              </span>
            )}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
