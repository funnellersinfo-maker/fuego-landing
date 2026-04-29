'use client';

import { Flame, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Menú', href: '#menu' },
    { label: 'Reservas', href: '#reservas' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'FAQ', href: '#faq' },
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com/fuegomedellin',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      label: 'TikTok',
      href: 'https://tiktok.com/@fuegomedellin',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.18 8.18 0 004.76 1.52V7.05a4.36 4.36 0 01-1-.36z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com/fuegomedellin',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Desktop: 4 columns, Mobile: stacked cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">

          {/* Logo & Description */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-0 sm:border-0 sm:bg-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-7 w-7 text-flame" />
              <span className="font-[family-name:var(--font-archivo-black)] text-2xl text-white uppercase">
                FUEGO
                <span className="text-flame">.</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              No hacemos comida rápida. Hacemos comida real, rápido.
              Ingredientes de origen, sabor legendario en el corazón de
              Medellín.
            </p>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-0 sm:border-0 sm:bg-transparent">
            <h3 className="font-[family-name:var(--font-archivo-black)] text-xs uppercase tracking-wider text-white/70 mb-4">
              Menú Rápido
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-flame transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Card style on mobile */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-0 sm:border-0 sm:bg-transparent">
            <h3 className="font-[family-name:var(--font-archivo-black)] text-xs uppercase tracking-wider text-white/70 mb-4">
              Contacto
            </h3>
            <div className="space-y-3">
              <a
                href="https://maps.google.com/?q=Cra+43A+%2310+Sur-50+Medellin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <MapPin className="h-4 w-4 text-flame/60 mt-0.5 shrink-0" />
                <span className="leading-snug">Cra 43A #10 Sur-50, El Poblado</span>
              </a>
              <a
                href="tel:+573000000000"
                className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <Phone className="h-4 w-4 text-flame/60 shrink-0" />
                <span>+57 300 000 0000</span>
              </a>
              <a
                href="mailto:hola@fuegomedellin.com"
                className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors break-all"
              >
                <Mail className="h-4 w-4 text-flame/60 shrink-0" />
                <span>hola@fuegomedellin.com</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/40">
                <Clock className="h-4 w-4 text-flame/60 shrink-0" />
                <span>Lun - Dom: 11AM - 11PM</span>
              </div>
            </div>
          </div>

          {/* Social - Card style on mobile */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-0 sm:border-0 sm:bg-transparent">
            <h3 className="font-[family-name:var(--font-archivo-black)] text-xs uppercase tracking-wider text-white/70 mb-4">
              Síguenos
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-flame hover:border-flame/30 hover:bg-flame/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/30 leading-relaxed">
              ¡Síguenos para promos exclusivas y contenido behind the scenes! 🔥
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-xs text-white/30">
            © {currentYear} FUEGO. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20">
            Hecho con 🔥 en Medellín, Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
