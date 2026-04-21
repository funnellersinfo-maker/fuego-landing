'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function WhatsAppButton() {
  const whatsappUrl =
    'https://wa.me/573000000000?text=Hola%20FUEGO!%20Quiero%20hacer%20un%20pedido';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg cursor-pointer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Haz tu pedido por WhatsApp"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-pulse" />
          <MessageCircle className="relative z-10 h-7 w-7 fill-white" />
        </motion.a>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="bg-[#25D366] text-white border-none font-medium"
      >
        Haz tu pedido
      </TooltipContent>
    </Tooltip>
  );
}
