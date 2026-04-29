'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Flame, ShoppingBag, ChevronDown, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { menuCategories, formatPrice, type MenuItem } from '@/data/menu';

const WHATSAPP_NUMBER = '573202761748';

interface CartItem {
  item: MenuItem;
  qty: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'cart-update' | 'upsell' | 'order-ready' | 'menu-list';
  upsellItem?: MenuItem;
  cartSnapshot?: string;
}

const INITIAL_SUGGESTIONS = [
  { label: '🍔 Ver Menú', message: 'Muéstrame el menú completo con precios' },
  { label: '🔥 Recomiéndame', message: '¿Qué me recomiendas para hoy?' },
  { label: '💯 Combos', message: 'Cuéntame sobre los combos disponibles' },
  { label: '📍 Ubicación', message: '¿Dónde están ubicados y cuál es el horario?' },
  { label: '💳 Pagos', message: '¿Qué métodos de pago aceptan?' },
];

const CATEGORY_QUERIES: Record<string, string> = {
  hamburguesas: 'hamburguesas',
  pollo: 'pollo',
  parrilla: 'parrilla',
  callejeros: 'callejeros',
  sides: 'guarniciones o sides',
  bebidas: 'bebidas',
  postres: 'postres',
  combos: 'combos',
};

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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! 🔥 Soy el asistente FUEGO. Puedo ayudarte con el menú, recomendaciones, o armar tu pedido. ¡Pregúntame lo que quieras!',
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatIdRef = useRef<string>('');

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const updateCartQty = useCallback((itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => (c.item.id === itemId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0);
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  }, []);

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // Prevent scroll on parent page when scrolling inside chat
  const handleChatScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
  }, []);

  const handleSuggestionClick = useCallback(
    (message: string) => {
      if (isLoading) return;
      sendMessage(message);
    },
    [isLoading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        type: 'text',
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const chatHistory = messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistory }),
        });

        const data = await response.json();
        const replyContent: string = data.reply || data.error || 'Lo siento, hubo un error.';

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          type: 'text',
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Smart upsell: if cart has items and user seems ready to order
        if (cart.length > 0 && (text.toLowerCase().includes('pedir') || text.toLowerCase().includes('ordenar') || text.toLowerCase().includes('listo') || text.toLowerCase().includes('comprar'))) {
          const upsellCandidates = getAllItems().filter(
            (item) => !cart.some((c) => c.item.id === item.id)
          );
          if (upsellCandidates.length > 0) {
            const upsellItem = upsellCandidates[Math.floor(Math.random() * Math.min(5, upsellCandidates.length))];
            setTimeout(() => {
              const upsellMsg: Message = {
                id: `upsell-${Date.now()}`,
                role: 'assistant',
                content: `Antes de confirmar... ¿qué tal si agregas ${upsellItem.name} (${formatPrice(upsellItem.price)})? Combina perfecto con tu pedido 🎯`,
                type: 'upsell',
                upsellItem: upsellItem,
              };
              setMessages((prev) => [...prev, upsellMsg]);
            }, 1500);
          }
        }
      } catch {
        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '¡Ups! Problema de conexión. Intenta de nuevo o escríbenos por WhatsApp 📱',
          type: 'text',
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, cart] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage(input);
  };

  const handleUpsellAccept = (item: MenuItem) => {
    addToCart(item);
    const msg: Message = {
      id: `cart-${Date.now()}`,
      role: 'system',
      content: `✅ ${item.name} agregado al pedido`,
      type: 'cart-update',
      cartSnapshot: JSON.stringify(cart),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleOrderNow = () => {
    if (cart.length === 0) return;
    const url = buildWhatsAppUrl(cart);
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-[60] flex items-center justify-center rounded-full shadow-lg transition-all cursor-pointer ${
          isOpen
            ? 'bottom-[calc(500px+1rem)] sm:bottom-[calc(540px+1rem)] right-4 sm:right-6 h-10 w-10 bg-white/10 backdrop-blur-md border border-white/20 text-white'
            : 'bottom-24 right-4 sm:right-6 h-16 w-16 bg-gradient-to-br from-flame to-orange-600 text-white shadow-[0_0_20px_rgba(255,69,0,0.4)]'
        }`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat FUEGO'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
            {cartCount}
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-2 left-2 right-2 sm:left-auto sm:right-6 sm:bottom-6 z-[60] flex flex-col sm:w-[400px] h-[500px] sm:h-[540px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - WhatsApp style */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1a0a0a] to-[#0a0a0a] border-b border-white/10 shrink-0">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-flame to-orange-600">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  FUEGO Bot
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-flame/20 text-flame font-medium">IA</span>
                </h3>
                <p className="text-xs text-green-400/80">En línea</p>
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

            {/* Content area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
                      <button onClick={() => setShowCart(false)} className="text-xs text-white/40 hover:text-white cursor-pointer">← Chat</button>
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
                                <button
                                  onClick={() => updateCartQty(c.item.id, -1)}
                                  className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                  <Minus className="h-3 w-3 text-white/70" />
                                </button>
                                <span className="text-sm font-semibold text-white w-5 text-center">{c.qty}</span>
                                <button
                                  onClick={() => updateCartQty(c.item.id, 1)}
                                  className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                  <Plus className="h-3 w-3 text-white/70" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(c.item.id)}
                                  className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors cursor-pointer ml-1"
                                >
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
                    ref={chatContainerRef}
                  >
                    {/* Messages list */}
                    <div
                      className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 custom-scrollbar"
                      onScroll={handleChatScroll}
                      onTouchMove={(e) => {
                        const el = e.currentTarget;
                        const atTop = el.scrollTop <= 0;
                        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
                        if (!atTop && !atBottom) {
                          e.stopPropagation();
                        }
                      }}
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
                            /* Upsell card */
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
                          ) : (
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                msg.role === 'user'
                                  ? 'bg-[#005c4b] text-white rounded-br-sm'
                                  : 'bg-[#1a1a1a] text-white/90 rounded-bl-sm border border-white/[0.06]'
                              }`}
                            >
                              {msg.content}
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

                    {/* Suggestions */}
                    {messages.length <= 1 && !isLoading && (
                      <div className="px-4 pb-2 shrink-0">
                        <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Preguntas frecuentes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {INITIAL_SUGGESTIONS.map((s) => (
                            <button
                              key={s.label}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSuggestionClick(s.message);
                              }}
                              className="rounded-full border border-flame/20 bg-flame/5 px-3 py-1.5 text-[11px] text-flame/80 hover:bg-flame/15 hover:border-flame/40 transition-colors cursor-pointer"
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick add: if cart has items show order prompt */}
                    {cart.length > 0 && messages.length > 2 && (
                      <div className="px-4 pb-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderNow();
                          }}
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
                            e.stopPropagation();
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
        )}
      </AnimatePresence>
    </>
  );
}

// Helper
function getAllItems(): MenuItem[] {
  return menuCategories.flatMap((cat) => cat.items);
}
