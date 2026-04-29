import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { menuCategories, formatPrice } from '@/data/menu';

const WHATSAPP_NUMBER = '573202761748';

const SYSTEM_PROMPT = `Eres FUEGO Bot, el asistente virtual inteligente del restaurante premium FUEGO en Medellín, Colombia.

INFORMACIÓN DEL RESTAURANTE:
- Nombre: FUEGO
- Ubicación: Carrera 43A #10 Sur-50, Medellín, barrio El Poblado
- Horario: Lunes a Domingo, 11:00 AM - 11:00 PM
- Teléfono: +57 320 276 1748
- Email: hola@fuegomedellin.com
- Instagram: @fuegomedellin
- TikTok: @fuegomedellin
- Características: Penthouse rooftop con piscina infinity, vista panorámica a Medellín, terraza, zona VIP Pool
- Áreas: Terraza, Interior, VIP Pool
- Métodos de pago: Efectivo, tarjeta (Visa, Mastercard, American Express), Nequi, Daviplata, Bancolombia
- Delivery: Disponible por PedidosYa, Rappi, y pedido directo por WhatsApp
- Política de alérgenos: Informamos sobre ingredientes en cada plato. Consultar con el mesero.

MENÚ COMPLETO:
${menuCategories.map(cat => {
  return `\n${cat.name}:\n${cat.items.map(item => 
    \`  - ${item.name}: ${formatPrice(item.price)} - ${item.description}${item.isNew ? ' [NUEVO]' : ''}${item.isPopular ? ' [POPULAR]' : ''}\\n    Ingredientes: ${item.ingredients.join(', ')}\`
  ).join('\n')}`;
}).join('\n')}

REGLAS DE CONVERSACIÓN:
1. Responde SIEMPRE en español colombiano, cálido y entusiasta
2. Sé conciso pero útil — max 3-4 oraciones por respuesta
3. Cuando recomiendes platos, explica por qué y sugiere acompañamientos
4. Si preguntan por precios, da el precio exacto en COP
5. Si el usuario pregunta por un plato, también menciona un complemento que combine bien (upsell natural)
6. Si el usuario quiere pedir, dile que puede usar el carrito en el chat o pedir directamente por WhatsApp
7. WhatsApp directo: https://wa.me/${WHATSAPP_NUMBER}
8. NO inventes información que no esté en tu base de conocimientos
9. Usa emojis moderadamente 🔥
10. Si alguien pregunta qué es popular, recomienda: Hamburguesa Clásica ($22.000), Doble Smash ($28.000), Alitas 8pcs ($18.000), Salchipapas FUEGO ($16.000)
11. Para combos, menciona que el Combo Familiar alimenta 4 personas por $89.000 — excelente valor
12. Si preguntan por delivery, menciona que pueden pedir por Rappi, PedidosYa o WhatsApp directo
13. Si el usuario menciona alérgenos, menciona que siempre pueden consultar con el mesero para detalles específicos`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron mensajes' },
        { status: 400 }
      );
    }

    const conversationMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Keep last 20 messages for context
    const recentMessages = conversationMessages.slice(-20);

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      'Lo siento, no pude procesar tu solicitud. ¿Podrías intentarlo de nuevo? 🔥';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        reply:
          '¡Ups! Tuve un pequeño problema técnico. ¿Podrías intentar de nuevo? Si prefieres, puedes escribirnos directamente por WhatsApp 📱',
      },
      { status: 500 }
    );
  }
}
