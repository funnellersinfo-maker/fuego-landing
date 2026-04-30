'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { menuCategories, formatPrice, type MenuItem } from '@/data/menu';
import { ArrowRight, Flame } from 'lucide-react';

function MenuCard({ item }: { item: MenuItem }) {
  const whatsappMessage = encodeURIComponent(
    `¡Hola FUEGO! Me gustaría ordenar: ${item.name} (${formatPrice(item.price)})`
  );
  const whatsappUrl = `https://wa.me/573000000000?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:border-flame/30 hover:shadow-[0_0_30px_rgba(255,69,0,0.15)]"
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-black">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isPopular && (
            <Badge className="bg-gold text-black font-semibold border-none text-[10px] uppercase tracking-wider">
              <Flame className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          {item.isNew && (
            <Badge className="bg-flame text-white font-semibold border-none text-[10px] uppercase tracking-wider">
              Nuevo
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-[family-name:var(--font-archivo-black)] text-base text-white uppercase leading-tight">
            {item.name}
          </h3>
          <span className="flex-shrink-0 font-[family-name:var(--font-archivo-black)] text-lg text-flame">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-xs text-white/50 leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {item.ingredients.slice(0, 3).map((ing) => (
            <span
              key={ing}
              className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40 border border-white/5"
            >
              {ing}
            </span>
          ))}
          {item.ingredients.length > 3 && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30 border border-white/5">
              +{item.ingredients.length - 3}
            </span>
          )}
        </div>

        {/* Order Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full bg-flame hover:bg-flame/80 text-white text-xs uppercase tracking-wider font-semibold h-9 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,69,0,0.3)] dopamine-hint shimmer-overlay">
            Ordenar Ahora
            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const activeItems =
    menuCategories.find((c) => c.id === activeCategory)?.items ?? [];

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-4 sm:px-6"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-flame text-xs uppercase tracking-[0.3em] font-medium">
            Nuestro Menú
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-archivo-black)] text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none">
            EL <span className="text-flame">MENÚ</span> DE FUEGO
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Ingredientes de origen, sabores legendarios. Cada plato es una
            experiencia que prende fuego a tus sentidos.
          </p>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center sm:flex-wrap"
        >
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-flame text-white border-flame shadow-[0_0_20px_rgba(255,69,0,0.3)]'
                  : 'bg-transparent text-white/50 border-white/10 hover:border-white/20 hover:text-white/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {activeItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
