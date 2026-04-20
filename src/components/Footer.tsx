'use client';

import { Flame, Instagram } from 'lucide-react';

function InstagramIcon() {
  return <Instagram className="h-5 w-5" />;
}

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
      icon: <InstagramIcon />,
    },
    {
      label: 'TikTok',
      href: 'https://tiktok.com/@fuegomedellin',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.18 8.18 0 004.76 1.52V7.05a4.36 4.36 0 01-1-.36z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com/fuegomedellin',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-7 w-7 text-flame" />
              <span className="font-[family-name:var(--font-archivo-black)] text-2xl text-white uppercase">
                FUEGO
                <span className="text-flame">.</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              No hacemos comida rápida. Hacemos comida real, rápido.
              Ingredientes de origen, sabor legendario en el corazón de
              Medellín.
            </p>
          </div>

          {/* Quick Links */}
          <div>
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

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-archivo-black)] text-xs uppercase tracking-wider text-white/70 mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-white/40">
              <li>Cra 43A #10 Sur-50</li>
              <li>El Poblado, Medellín</li>
              <li>+57 300 000 0000</li>
              <li>hola@fuegomedellin.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
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
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/40 hover:text-flame hover:border-flame/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/30">
              Lun - Dom: 11AM - 11PM
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
