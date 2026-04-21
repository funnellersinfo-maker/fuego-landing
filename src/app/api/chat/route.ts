import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { menuCategories, formatPrice } from '@/data/menu';

const SYSTEM_PROMPT = `Eres FUEGO, el asistente virtual del restaurante premium FUEGO en Medellín, Colombia. 

INFORMACIÓN DEL RESTAURANTE:
- Nombre: FUEGO
- Ubicación: Carrera 43A #10 Sur-50, Medellín, barrio El Poblado
- Horario: Lunes a Domingo, 11:00 AM - 11:00 PM
- Teléfono: +57 300 000 0000
- Email: hola@fuegomedellin.com
- Instagram: @fuegomedellin
- TikTok: @fuegomedellin
- Características: Penthouse rooftop con piscina infinity, vista panorámica a Medellín, terraza, zona VIP Pool
- Áreas: Terraza, Interior, VIP Pool
- Métodos de pago: Efectivo, tarjeta (Visa, Mastercard, American Express), Nequi, Daviplata, Bancolombia
- Delivery: Disponible por PedidosYa, Rappi, y pedido directo por WhatsApp
- Política de alérgenos: Informamos sobre ingredientes en cada plato. Consultar con el mesero sobre alérgenos específicos.

MENÚ COMPLETO:
${menuCategories.map(cat => {
  return `\n${cat.name}:\n${cat.items.map(item => 
    `  • ${item.name}: ${formatPrice(item.price)} - ${item.description}${item.isNew ? ' [NUEVO]' : ''}${item.isPopular ? ' [POPULAR]' : ''} | Ingredientes: ${item.ingredients.join(', ')}`
  ).join('\n')}`;
}).join('\n')}

REGLAS DE CONVERSACIÓN:
1. Responde SIEMPRE en español colombiano, de forma amigable y entusiasta
2. Usa un tono cálido y apasionado, como un mesero que ama su trabajo
3. Sé conciso pero informativo - max 3-4 oraciones por respuesta
4. Cuando recomiendes platos, menciona por qué son buenos y sugiere maridajes
5. Si preguntan por precios, da el precio exacto en COP
6. Si no tienes información sobre algo específico, redirige a WhatsApp o al restaurante
7. Si el usuario parece satisfecho y no tiene más preguntas, invítalo amablemente a hacer su pedido por WhatsApp: https://wa.me/573000000000?text=Hola%20FUEGO!%20Quiero%20hacer%20un%20pedido
8. NO inventes información que no esté en tu base de conocimientos
9. Puedes usar emojis moderadamente para hacer la conversación más amigable 🔥`;

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
