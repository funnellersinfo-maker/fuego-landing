'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Flame, ShoppingBag, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { menuCategories, formatPrice, getAllItems, getPopularItems, type MenuItem } from '@/data/menu';

const WHATSAPP_NUMBER = '573202761748';

interface CartItem {
  item: MenuItem;
  qty: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'cart-update' | 'upsell' | 'menu-list' | 'item-card';
  upsellItem?: MenuItem;
  items?: MenuItem[];
}

interface Suggestion {
  id: string;
  label: string;
  message: string;
}

// Full pool — never repeats until exhausted
const SUGGESTION_POOL: Suggestion[] = [
  { id: 's1', label: '🍔 Ver Menú', message: 'Muéstrame el menú completo' },
  { id: 's2', label: '🔥 Recomiéndame', message: '¿Qué me recomiendas?' },
  { id: 's3', label: '💯 Combos', message: '¿Qué combos tienen?' },
  { id: 's4', label: '📍 Ubicación', message: '¿Dónde están ubicados?' },
  { id: 's5', label: '💳 Pagos', message: '¿Qué métodos de pago aceptan?' },
  { id: 's6', label: '🐕 Callejeros', message: '¿Qué comida callejera tienen?' },
  { id: 's7', label: '🍗 Pollo', message: 'Muéstrame las opciones de pollo' },
  { id: 's8', label: '🥩 Parrilla', message: '¿Qué tienen de parrilla?' },
  { id: 's9', label: '🍟 Sides', message: '¿Qué acompañamientos tienen?' },
  { id: 's10', label: '🥤 Bebidas', message: 'Muéstrame las bebidas disponibles' },
  { id: 's11', label: '🍨 Postres', message: '¿Qué postres tienen?' },
  { id: 's12', label: '🆕 Novedades', message: '¿Qué hay de nuevo en el menú?' },
  { id: 's13', label: '🛵 Domicilio', message: '¿Hacen domicilios?' },
  { id: 's14', label: '📅 Reservas', message: '¿Cómo puedo reservar mesa?' },
  { id: 's15', label: '💰 Precios', message: '¿Cuáles son los precios?' },
  { id: 's16', label: '🌶️ Salsas', message: '¿Qué salsas y extras tienen?' },
  { id: 's17', label: '⏰ Horarios', message: '¿A qué hora abren y cierran?' },
  { id: 's18', label: '🏆 Popular', message: '¿Qué es lo más pedido?' },
  { id: 's19', label: '🧾 Ingredientes', message: '¿Qué lleva la hamburguesa de trufa?' },
  { id: 's20', label: '💵 Presupuesto', message: '¿Qué puedo comer con $20.000?' },
];

const VISIBLE_SUGGESTION_COUNT = 5;

function pickInitialSuggestions(): Suggestion[] {
  const shuffled = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, VISIBLE_SUGGESTION_COUNT);
}

function pickReplacement(excludeIds: Set<string>): Suggestion | null {
  const available = SUGGESTION_POOL.filter((s) => !excludeIds.has(s.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// ═══════════════════════════════════════════════════════
// INTERNAL CHAT ENGINE — 100% local, no API calls
// ═══════════════════════════════════════════════════════

function buildWhatsAppUrl(cart: CartItem[]): string {
  if (cart.length === 0) return '';
  const total = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  let text = '🔥 *PEDIDO FUEGO*\n\n';
  let idx = 1;
  for (const c of cart) {
    text += `${idx}. *${c.item.name}* x${c.qty} - ${formatPrice(c.item.price * c.qty)}\n`;
    idx++;
  }
  text += `\n💰 *Total: ${formatPrice(total)}*\n`;
  text += '\n¡Gracias por pedir en FUEGO! 🔥';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function pickRandom<T>(arr: T[], count: number = 1): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function formatItemList(items: MenuItem[]): string {
  return items
    .map((item) => `• *${item.name}* — ${formatPrice(item.price)}\n  ${item.description}`)
    .join('\n\n');
}

function generateReply(userMsg: string): { text: string; items?: MenuItem[]; upsellItem?: MenuItem } {
  const q = userMsg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // ─── MENU COMPLETO ───
  if (q.match(/menu\s*completo|ver\s*menu|menu|carta|que\s*tienen|mostrar\s*todo|todo\s*el\s*menu|que\s*venden/)) {
    let response = '🔥 *MENÚ FUEGO*\n\n';
    for (const cat of menuCategories) {
      response += `*${cat.name}*\n`;
      for (const item of cat.items) {
        const badge = item.isNew ? ' 🆕' : item.isPopular ? ' ⭐' : '';
        response += `• ${item.name}${badge} — ${formatPrice(item.price)}\n`;
      }
      response += '\n';
    }
    response += '¿Te llama la atención algo? Puedo darte más detalles de cualquier plato.';
    return { text: response };
  }

  // ─── CATEGORÍAS ESPECÍFICAS ───
  const catMap: Record<string, string> = {
    'hamburguesa': 'hamburguesas',
    'burger': 'hamburguesas',
    'hambur': 'hamburguesas',
    'pollo': 'pollo',
    'parrilla': 'parrilla',
    'carne': 'parrilla',
    'asado': 'parrilla',
    'costilla': 'parrilla',
    'lomo': 'parrilla',
    'arrachera': 'parrilla',
    'callejero': 'callejeros',
    'perro': 'callejeros',
    'salchipapa': 'callejeros',
    'choriperr': 'callejeros',
    'mazorcada': 'callejeros',
    'side': 'sides',
    'guarnicion': 'sides',
    'papa': 'sides',
    'nachos': 'sides',
    'ensalada': 'sides',
    'aros': 'sides',
    'cebolla': 'sides',
    'bebida': 'bebidas',
    'gaseosa': 'bebidas',
    'jugo': 'bebidas',
    'limonada': 'bebidas',
    'malta': 'bebidas',
    'cerveza': 'bebidas',
    'agua': 'bebidas',
    'postre': 'postres',
    'brownie': 'postres',
    'helado': 'postres',
  };

  for (const [keyword, catId] of Object.entries(catMap)) {
    if (q.includes(keyword)) {
      const cat = menuCategories.find((c) => c.id === catId);
      if (cat) {
        const text = `*${cat.name}*\n\n${formatItemList(cat.items)}\n\n¿Quieres agregar alguno a tu pedido? 🛒`;
        return { text, items: cat.items };
      }
    }
  }

  // ─── COMBOS ───
  if (q.match(/combo/)) {
    const comboCat = menuCategories.find((c) => c.id === 'combos');
    if (comboCat) {
      const text = `🔥 *COMBOS FUEGO*\n\n${formatItemList(comboCat.items)}\n\nLos combos son la mejor opción para aprovechar al máximo. ¿Te interesa alguno?`;
      return { text, items: comboCat.items };
    }
  }

  // ─── RECOMENDACIONES ───
  if (q.match(/recomiend|suger|que\s*me\s*acons|que\s*pido|no\s*se\s*que\s*pedir|que\s*es\s*lo\s*mejor|popular|lo\s*mas\s*pedido|favorit/)) {
    const popular = getPopularItems();
    const top3 = pickRandom(popular, 3);
    const text = `🔥 *LO MÁS PEDIDO EN FUEGO*\n\n${formatItemList(top3)}\n\nEstos son los favoritos de nuestros clientes. ¿Te animas a probar alguno?`;
    return { text, items: top3 };
  }

  // ─── PRECIOS ───
  if (q.match(/precio|cuanto\s*cuesta|cuanto\s*es|cuales\s*son\s*los\s*precios|valor|costo|tarifa/)) {
    let response = '💰 *PRECIOS FUEGO*\n\n';
    for (const cat of menuCategories) {
      response += `*${cat.name}*\n`;
      for (const item of cat.items) {
        response += `• ${item.name}: ${formatPrice(item.price)}\n`;
      }
      response += '\n';
    }
    response += '¿Buscas algo en tu presupuesto? Dime cuánto quieres gastar y te recomiendo.';
    return { text: response };
  }

  // ─── PRESUPUESTO ───
  if (q.match(/presupuesto|gastar|hasta\s*\$|tengo\s*\d|menos\s*de|entre\s*\d/)) {
    const numbers = q.match(/\d+/);
    const budget = numbers ? parseInt(numbers[0]) : 25000;
    const affordable = getAllItems().filter((i) => i.price <= budget && !i.id.includes('combo'));
    if (affordable.length > 0) {
      const picks = pickRandom(affordable, Math.min(4, affordable.length));
      const text = `Por *${formatPrice(budget)}* o menos puedes disfrutar:\n\n${formatItemList(picks)}\n\n¿Te gusta algo de aquí?`;
      return { text, items: picks };
    }
    return { text: `Hmm, por ${formatPrice(budget)} no encontramos opciones individuales, ¡pero nuestros combos tienen excelente relación precio-calidad! Pregúntame por combos.` };
  }

  // ─── INGREDIENTES / ALÉRGENOS ───
  if (q.match(/ingrediente|alergen|sin\s*gluten|vegetarian|sin\s*carne|que\s*lleva|contiene/)) {
    const itemName = q.replace(/ingrediente|alergen|sin\s*gluten|vegetarian|sin\s*carne|que\s*lleva|contiene|de\s*la|hamburger|del?\s?/gi, '').trim();
    const allItems = getAllItems();
    const match = allItems.find((i) => i.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(itemName));
    if (match) {
      const text = `*${match.name}*\n\n📝 ${match.description}\n\n🧾 *Ingredientes:* ${match.ingredients.join(', ')}\n\n💰 *Precio:* ${formatPrice(match.price)}`;
      return { text, items: [match] };
    }
    return { text: '¿De qué plato quieres saber los ingredientes? Dime el nombre y te doy todos los detalles.' };
  }

  // ─── UBICACIÓN Y HORARIOS ───
  if (q.match(/ubicacion|donde\s*estan|direccion|como\s*llego|horario|abren|cierran|que\s*horas|que\s*dias|a\s*que\s*hora/)) {
    return {
      text: '📍 *UBICACIÓN Y HORARIOS*\n\n🏠 *Dirección:* Cra 43A # 10 Sur-50, Medellín (Penthouse Rooftop)\n\n🕐 *Horarios:*\n• Martes a Jueves: 12pm - 10pm\n• Viernes y Sábado: 12pm - 12am\n• Domingos: 12pm - 6pm\n• Lunes: Cerrado\n\n🚗 Estacionamiento disponible en el edificio.',
    };
  }

  // ─── MÉTODOS DE PAGO ───
  if (q.match(/pago|pagar|efectivo|tarjeta|nequi|daviplata|transaccion|dinero/)) {
    return {
      text: '💳 *MÉTODOS DE PAGO*\n\n• Efectivo\n• Tarjeta (crédito y débito)\n• Nequi\n• Daviplata\n• Transferencia bancaria\n\nTodos los pedidos para llevar o domicilio se pagan contra entrega o por WhatsApp.',
    };
  }

  // ─── DOMICILIO ───
  if (q.match(/domicilio|envio|delivery|llevar|traer|pedir\?/)) {
    return {
      text: '🛵 *DOMICILIOS*\n\nHacemos envíos por toda el área metropolitana de Medellín. Puedes pedir directamente por este chat (agrega productos al carrito) o por WhatsApp.\n\n📞 El tiempo estimado de entrega es de 30-45 minutos dependiendo de la zona.\n\n¿Quieres ver el menú para armar tu pedido?',
    };
  }

  // ─── RESERVAS ───
  if (q.match(/reserv|mesa|reservar|cita|agendar/)) {
    return {
      text: '📅 *RESERVAS*\n\nPuedes reservar tu mesa directamente en nuestra landing, en la sección "RESERVA TU EXPERIENCIA" más abajo. O si prefieres, escríbenos por WhatsApp.\n\nContamos con:\n• Terraza al aire libre\n• Interior climatizado\n• VIP Pool (piscina infinity)\n\n¡Te esperamos! 🔥',
    };
  }

  // ─── AGREGAR AL PEDIDO ───
  if (q.match(/agregar|quiero\s*este|pedir\s*este|añadir|poneme|meteme|armar\s*pedido|lo\s*quiero/)) {
    const allItems = getAllItems();
    const matched = allItems.filter((i) => {
      const name = i.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return name.split(/\s+/).some((word) => word.length > 3 && q.includes(word));
    });
    if (matched.length > 0) {
      const item = matched[0];
      return {
        text: `¡Excelente elección! 🎉 Puedes agregar *${item.name}* (${formatPrice(item.price)}) directamente desde las tarjetas del menú o haz clic en "+ Agregar" aquí mismo.`,
        items: [item],
        upsellItem: pickRandom(allItems.filter((i) => i.id !== item.id && (i.id.includes('papas') || i.id.includes('gaseosa') || i.id.includes('limonada'))), 1)[0],
      };
    }
    return { text: '¿Qué producto te gustaría agregar? Puedes decirme el nombre o buscar por categoría (hamburguesas, pollo, combos...).' };
  }

  // ─── SALUDO ───
  if (q.match(/hola|buenas|hey|hi|que\s*tal|saludos|buenos\s*dias|buenas\s*tardes|buenas\s*noches/)) {
    return {
      text: '¡Hola! 🔥 Bienvenido a FUEGO. ¿En qué puedo ayudarte?\n\nPuedo mostrarte el menú, recomendarte platos según tu gusto, darte precios o ayudarte a armar tu pedido.',
    };
  }

  // ─── GRACIAS ───
  if (q.match(/gracias|thanks|genial|chevere|increible|perfecto|ok|listo|vale/)) {
    return {
      text: '¡De nada! 😊 Si necesitas algo más, aquí estoy. ¡Que disfrutes tu experiencia FUEGO! 🔥',
    };
  }

  // ─── DESPEDIDA ───
  if (q.match(/adios|bye|chao|hasta\s*luego|nos\s*vemos/)) {
    return {
      text: '¡Hasta pronto! 🔥 Esperamos verte pronto en FUEGO. Recuerda que puedes pedir por WhatsApp en cualquier momento.',
    };
  }

  // ─── NUEVOS PRODUCTOS ───
  if (q.match(/nuevo|novedad|que\s*hay\s*de\s*nuevo|estren|acaba|recien|llego/)) {
    const newItems = getAllItems().filter((i) => i.isNew);
    if (newItems.length > 0) {
      return {
        text: `🆕 *NUEVEDADES EN FUEGO*\n\n${formatItemList(newItems)}\n\n¡Pruébalos antes de que se agoten! ¿Te tienta alguno?`,
        items: newItems,
      };
    }
  }

  // ─── SALSAS / EXTRAS ───
  if (q.match(/salsa|extra|adicional|complement|que\s*puedo\s*agregar/)) {
    return {
      text: '🌶️ *SALSAS Y EXTRAS*\n\nContamos con:\n• Salsa FUEGO (nuestra secreta)\n• BBQ ahumada\n• Chipotle\n• Miel mostaza\n• Guacamole\n• Queso fundido\n• Chimi churri\n\nPuedes pedir cualquier extra con tu pedido sin costo adicional con hamburguesas y parrilla.',
    };
  }

  // ─── DEFAULT: fallback inteligente ───
  const popular = getPopularItems();
  const randomPick = pickRandom(popular, 2);
  return {
    text: `Hmm, no estoy seguro de lo que buscas, pero te puedo ayudar con:\n\n• 🍔 *Ver el menú* — "Muéstrame el menú"\n• 🔥 *Recomendaciones* — "¿Qué me recomiendas?"\n• 💰 *Precios* — "¿Cuánto cuesta?"\n• 📍 *Ubicación* — "¿Dónde están?"\n• 💳 *Pagos* — "¿Qué métodos de pago aceptan?"\n\nO pregúntame por cualquier plato por nombre. Por ejemplo: "¿Qué trae la Trufa?"`,
    upsellItem: randomPick[Math.floor(Math.random() * randomPick.length)],
  };
}

// ═══════════════════════════════════════════════════════
// CHAT WIDGET COMPONENT — Inline, visible section
// ═══════════════════════════════════════════════════════

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! 🔥 Soy el asistente FUEGO. Conozco todo nuestro menú, precios y puedo ayudarte a armar tu pedido. ¿Qué necesitas?',
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => pickInitialSuggestions());
  const [usedSuggestionIds, setUsedSuggestionIds] = useState<Set<string>>(() => new Set<string>());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);

  const scrollToBottom = useCallback(() => {
    // Only scroll within the chat container, never affect page scroll
    const container = chatContainerRef.current;
    const end = messagesEndRef.current;
    if (container && end) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    // Only auto-scroll after user has interacted (not on initial mount)
    if (hasInteracted.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const updateCartQty = useCallback((itemId: string, delta: number) => {
    setCart((prev) => prev.map((c) => (c.item.id === itemId ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  }, []);

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const sendMessageRef = useRef<(text: string) => void>(() => {});

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      if (isLoading) return;

      // Remove clicked suggestion and replace with a new one
      setSuggestions((prev) => {
        const filtered = prev.filter((s) => s.id !== suggestion.id);
        const allVisibleIds = new Set([...filtered.map((s) => s.id), ...usedSuggestionIds, suggestion.id]);
        const replacement = pickReplacement(allVisibleIds);
        if (replacement) {
          setUsedSuggestionIds((prevUsed) => new Set([...prevUsed, suggestion.id]));
          return [...filtered, replacement];
        }
        return [...filtered, SUGGESTION_POOL[Math.floor(Math.random() * SUGGESTION_POOL.length)]];
      });

      sendMessageRef.current(suggestion.message);
    },
    [isLoading, usedSuggestionIds] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;

      hasInteracted.current = true;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        type: 'text',
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      // Simulate typing delay for natural feel
      setTimeout(() => {
        const reply = generateReply(text);

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.text,
          type: reply.items ? 'menu-list' : 'text',
          items: reply.items,
          upsellItem: reply.upsellItem,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // Smart upsell: after adding items to cart
        if (cart.length > 0 && (text.toLowerCase().includes('pedir') || text.toLowerCase().includes('ordenar') || text.toLowerCase().includes('listo') || text.toLowerCase().includes('comprar') || text.toLowerCase().includes('enviar'))) {
          const upsellCandidates = getAllItems().filter(
            (item) => !cart.some((c) => c.item.id === item.id) && (item.id.includes('papas') || item.id.includes('limonada') || item.id.includes('brownie') || item.id.includes('alitas'))
          );
          if (upsellCandidates.length > 0) {
            const upsellItem = upsellCandidates[Math.floor(Math.random() * upsellCandidates.length)];
            setTimeout(() => {
              const upsellMsg: Message = {
                id: `upsell-${Date.now()}`,
                role: 'assistant',
                content: `¿Qué tal si completas tu pedido con ${upsellItem.name} (${formatPrice(upsellItem.price)})? Combina perfecto 🎯`,
                type: 'upsell',
                upsellItem: upsellItem,
              };
              setMessages((prev) => [...prev, upsellMsg]);
            }, 1200);
          }
        }

        setIsLoading(false);
      }, 500 + Math.random() * 500);
    },
    [isLoading, cart] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Keep ref in sync so handleSuggestionClick can call sendMessage
  sendMessageRef.current = sendMessage;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleUpsellAccept = (item: MenuItem) => {
    addToCart(item);
    const msg: Message = {
      id: `cart-${Date.now()}`,
      role: 'system',
      content: `✅ ${item.name} agregado al pedido`,
      type: 'cart-update',
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleItemAdd = (item: MenuItem) => {
    addToCart(item);
    const msg: Message = {
      id: `cart-${Date.now()}`,
      role: 'system',
      content: `✅ ${item.name} (${formatPrice(item.price)}) agregado al pedido`,
      type: 'cart-update',
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleOrderNow = () => {
    if (cart.length === 0) return;
    const url = buildWhatsAppUrl(cart);
    window.open(url, '_blank');
  };

  // ─── Format bold text (markdown-like *text*) ───
  function renderFormatted(text: string) {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} className="font-semibold text-flame">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  }

  return (
    <section id="chatbot" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,69,0,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-flame text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <MessageCircle className="h-3.5 w-3.5" />
            Asistente Virtual
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-archivo-black)] text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none">
            PREGÚNTAME <span className="text-flame">LO QUE QUIERAS</span>
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Conozco todo nuestro menú, precios y puedo ayudarte a armar tu pedido. Sin esperas, respuesta inmediata.
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1a0a0a] to-[#0a0a0a] border-b border-white/10">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-flame to-orange-600">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                FUEGO Bot
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-flame/20 text-flame font-medium">ONLINE</span>
              </h3>
              <p className="text-xs text-green-400/80">Responde al instante</p>
            </div>
            {/* Cart toggle */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Carrito"
            >
              <ShoppingBag className="h-5 w-5 text-white/60" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-flame text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex flex-col" style={{ height: '460px' }}>
            <AnimatePresence mode="wait">
              {showCart ? (
                /* ─── Cart Panel ─── */
                <motion.div
                  key="cart"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-flame" />
                      Tu Pedido
                    </h3>
                    <button onClick={() => setShowCart(false)} className="text-xs text-white/40 hover:text-white cursor-pointer">
                      ← Chat
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
                    {cart.length === 0 ? (
                      <div className="text-center py-10">
                        <ShoppingBag className="h-12 w-12 text-white/10 mx-auto mb-3" />
                        <p className="text-sm text-white/30">Tu pedido está vacío</p>
                        <p className="text-xs text-white/20 mt-1">Pregúntame sobre el menú</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((c) => (
                          <div key={c.item.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{c.item.name}</p>
                              <p className="text-xs text-flame font-semibold">{formatPrice(c.item.price * c.qty)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateCartQty(c.item.id, -1)} className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <Minus className="h-3 w-3 text-white/70" />
                              </button>
                              <span className="text-sm font-semibold text-white w-5 text-center">{c.qty}</span>
                              <button onClick={() => updateCartQty(c.item.id, 1)} className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <Plus className="h-3 w-3 text-white/70" />
                              </button>
                              <button onClick={() => removeFromCart(c.item.id)} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors cursor-pointer ml-1">
                                <Trash2 className="h-3 w-3 text-red-400/60" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="px-4 py-3 border-t border-white/10 shrink-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Total</span>
                        <span className="text-lg font-bold text-flame">{formatPrice(cartTotal)}</span>
                      </div>
                      <button
                        onClick={handleOrderNow}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-sm hover:from-green-500 hover:to-green-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Enviar Pedido por WhatsApp
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* ─── Messages Panel ─── */
                <motion.div
                  key="messages"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Messages list */}
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 custom-scrollbar"
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.type === 'cart-update' && msg.role === 'system' ? (
                          <div className="w-full text-center">
                            <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400/80 border border-green-500/20">
                              {msg.content}
                            </span>
                          </div>
                        ) : msg.type === 'upsell' && msg.upsellItem ? (
                          <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-flame/10 to-orange-500/5 border border-flame/20 p-3 space-y-2.5">
                            <p className="text-sm text-white/90 leading-relaxed">{msg.content}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpsellAccept(msg.upsellItem!)}
                                className="flex-1 py-2 rounded-lg bg-flame text-white text-xs font-semibold hover:bg-flame/80 transition-colors cursor-pointer"
                              >
                                + Agregar
                              </button>
                              <button
                                onClick={() => {
                                  const declineMsg: Message = {
                                    id: `decline-${Date.now()}`,
                                    role: 'system',
                                    content: 'No gracias',
                                    type: 'cart-update',
                                  };
                                  setMessages((prev) => [...prev, declineMsg]);
                                }}
                                className="flex-1 py-2 rounded-lg bg-white/10 text-white/60 text-xs font-medium hover:bg-white/15 transition-colors cursor-pointer"
                              >
                                No, gracias
                              </button>
                            </div>
                          </div>
                        ) : msg.type === 'menu-list' && msg.items && msg.items.length > 0 ? (
                          <div className="max-w-[92%] space-y-2">
                            <div className="rounded-2xl rounded-bl-sm bg-[#1a1a1a] border border-white/[0.06] px-3.5 py-2.5 text-sm leading-relaxed text-white/90 whitespace-pre-line">
                              {renderFormatted(msg.content)}
                            </div>
                            {/* Item cards with add-to-cart */}
                            <div className="space-y-1.5">
                              {msg.items.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleItemAdd(item)}
                                  className="w-full flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 hover:bg-flame/[0.06] hover:border-flame/20 transition-all cursor-pointer text-left group"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white truncate group-hover:text-flame transition-colors">{item.name}</p>
                                    <p className="text-[10px] text-white/40 truncate">{item.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-bold text-flame">{formatPrice(item.price)}</span>
                                    <span className="h-6 w-6 rounded-full bg-flame/20 text-flame flex items-center justify-center text-xs font-bold group-hover:bg-flame group-hover:text-white transition-colors">+</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-[#005c4b] text-white rounded-br-sm'
                                : 'bg-[#1a1a1a] text-white/90 rounded-bl-sm border border-white/[0.06]'
                            }`}
                          >
                            {msg.role === 'assistant' ? renderFormatted(msg.content) : msg.content}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                        <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/[0.06]">
                          <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
                            <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                            <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Rotating Suggestions — always visible */}
                  {!isLoading && suggestions.length > 0 && (
                    <div className="px-4 pb-2 shrink-0">
                      <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Ideas rápidas</p>
                      <div className="flex flex-wrap gap-1.5">
                        <AnimatePresence initial={false}>
                          {suggestions.map((s) => (
                            <motion.button
                              key={s.id}
                              initial={{ opacity: 0, scale: 0.8, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.7, y: -5 }}
                              transition={{ duration: 0.25 }}
                              onClick={() => handleSuggestionClick(s)}
                              className="rounded-full border border-flame/20 bg-flame/5 px-3 py-1.5 text-[11px] text-flame/80 hover:bg-flame/15 hover:border-flame/40 transition-colors cursor-pointer dopamine-hint"
                            >
                              {s.label}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Quick order button */}
                  {cart.length > 0 && messages.length > 2 && (
                    <div className="px-4 pb-2 shrink-0">
                      <button
                        onClick={handleOrderNow}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-semibold hover:from-green-500 hover:to-green-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Enviar pedido ({formatPrice(cartTotal)})
                      </button>
                    </div>
                  )}

                  {/* Input bar */}
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5 bg-[#0a0a0a] shrink-0">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-flame text-white disabled:opacity-30 transition-all cursor-pointer hover:bg-flame/80"
                      aria-label="Enviar"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
