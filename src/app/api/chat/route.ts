import { HfInference } from '@huggingface/inference';

export const runtime = 'edge';

// Sistema de respuestas predefinidas como fallback
const predefinedResponses: Record<string, string> = {
  "default": "Gracias por contactar con Astrid y Gastón. ¿En qué puedo ayudarte hoy?",
  "hola": "¡Bienvenido a Astrid y Gastón! ¿En qué puedo asistirle hoy?",
  "reserva": "Para hacer una reserva, recomendamos hacerlo con 2 semanas de antelación. Puede usar nuestro formulario en la sección 'Reservas' o llamar al +51 1 442 2777.",
  "horario": "Estamos abiertos de martes a sábado: almuerzo 13:00-15:45 y cena 19:00-23:00. Domingos solo almuerzo (12:00-16:00). Lunes cerrados.",
  "menu": "Ofrecemos alta cocina peruana con platos como cebiche clásico, causa limeña, anticuchos, lomo saltado y postres tradicionales como suspiro a la limeña.",
  "ubicacion": "Nos encontramos en Casa Moreyra, Av. Paz Soldán 290, San Isidro, Lima, Perú.",
  "contacto": "Puede contactarnos por teléfono al +51 1 442 2777 o por correo electrónico a reservas@astridygaston.com",
  "wifi": "Sí, ofrecemos WiFi gratuito para todos nuestros clientes.",
  "ninos": "Recibimos familias con niños, aunque recomendamos que los pequeños sean mayores de 8 años para disfrutar mejor de la experiencia.",
  "gracias": "¡El placer es nuestro! Quedamos a su disposición para cualquier consulta adicional.",
  "adios": "¡Muchas gracias por su interés en Astrid y Gastón! Esperamos tener el honor de recibirle pronto.",
  "precio": "Nuestros entrantes oscilan entre 52-70 PEN, platos principales 75-95 PEN y postres 42-52 PEN. Contamos con menús degustación desde 350 PEN.",
  "disponible": "Recomendamos reservar con al menos 2 semanas de antelación para garantizar disponibilidad, especialmente en fines de semana.",
  "bebidas": "Ofrecemos Pisco Sour clásico, Chilcano, vinos peruanos y sudamericanos seleccionados, cerveza artesanal y chicha morada casera.",
  "chef": "Nuestro chef principal es Jorge Muñoz, quien continúa el legado gastronómico de nuestros fundadores Gastón Acurio y Astrid Gutsche.",
  "vegetariano": "Disponemos de opciones vegetarianas. Por favor, infórmenos con antelación para preparar una experiencia adaptada a sus preferencias.",
  "historia": "Fundado en 1994 por Gastón Acurio y Astrid Gutsche, hemos revolucionado la gastronomía peruana y somos uno de los mejores restaurantes de América Latina.",
  "oferta": "Lo siento, no dispongo de información sobre ofertas o promociones especiales actuales. Le recomiendo contactar directamente con el restaurante para consultar.",
  "especial": "Ofrecemos experiencias gastronómicas como menús degustación 'Perú Diverso' (450 PEN) y 'Amazonía' (350 PEN), ideales para ocasiones especiales.",
  "descuento": "Lo siento, no dispongo de información sobre descuentos actuales. Para consultas sobre tarifas especiales, contacte directamente con el restaurante.",
  "desconocido": "Lo siento, no dispongo de esa información específica. Le recomiendo contactar directamente con Astrid y Gastón al +51 1 442 2777 o reservas@astridygaston.com."
};

// Función para limpiar la respuesta de la IA
function cleanAIResponse(text: string): string {
  // Si la respuesta está vacía, devolver respuesta predeterminada
  if (!text || text.trim() === '') {
    return predefinedResponses.desconocido;
  }
  
  // Si el modelo responde que no sabe, usar respuesta predefinida para desconocido
  if (text.toLowerCase().includes('no dispongo de esa información') || 
      text.toLowerCase().includes('no tengo información') ||
      text.toLowerCase().includes('no puedo proporcionar') ||
      text.toLowerCase().includes('no se ofrece')) {
    return predefinedResponses.desconocido;
  }
  
  // Para saludos simples, mejor usar respuestas predefinidas
  if (text.toLowerCase().includes('hola') && text.length > 100) {
    return predefinedResponses.hola;
  }
  
  // Eliminar prefijos comunes del modelo
  const patterns = [
    /Tu respuesta:\s*/i,
    /La respuesta es:\s*/i,
    /Respuesta:\s*/i,
    /Asistente:\s*/i,
    /como asistente.*?:\s*/i
  ];
  
  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Eliminar patrones de conversación del entrenamiento
  if (cleaned.includes("Pregunta del cliente:")) {
    // Quedarse solo con la primera respuesta
    cleaned = cleaned.split("Pregunta del cliente:")[0].trim();
  }
  
  // Eliminar frases incompletas al final
  const puntuacionFinal = /[.!?](?:\s|$)/;
  const partes = cleaned.split(puntuacionFinal);
  
  if (partes.length > 1) {
    // Reconstruir solo frases completas
    let resultado = '';
    for (let i = 0; i < partes.length - 1; i++) {
      // Cada parte termina con un signo de puntuación que se eliminó en el split
      const match = cleaned.match(new RegExp(partes[i] + '[.!?]'));
      if (match) {
        resultado += match[0];
        
        // Limitar a 1-2 frases como máximo
        if (i >= 1) break;
      }
    }
    cleaned = resultado;
  }
  
  // Recortar la respuesta si es demasiado larga (ahora limitando a 150 caracteres)
  if (cleaned.length > 150) {
    // Buscar el último punto dentro del límite
    const ultimoPunto = cleaned.substring(0, 150).lastIndexOf('.');
    if (ultimoPunto > 80) {
      cleaned = cleaned.substring(0, ultimoPunto + 1);
    } else {
      cleaned = cleaned.substring(0, 150) + "...";
    }
  }
  
  return cleaned.trim();
}

// Función para encontrar una respuesta de fallback
function findFallbackResponse(message: string): string {
  if (!message || typeof message !== 'string') {
    return predefinedResponses.default;
  }
  
  const normalizedMessage = message.toLowerCase();
  
  // Para saludos, siempre usar la respuesta predefinida
  if (normalizedMessage.includes('hola')) {
    return predefinedResponses.hola;
  }
  
  // Patrones específicos
  if (normalizedMessage.includes('oferta') || 
      normalizedMessage.includes('promocion') || 
      normalizedMessage.includes('descuento') ||
      normalizedMessage.includes('especial')) {
    if (normalizedMessage.includes('descuento')) {
      return predefinedResponses.descuento;
    }
    if (normalizedMessage.includes('especial') && normalizedMessage.includes('menu')) {
      return predefinedResponses.especial;
    }
    return predefinedResponses.oferta;
  }
  
  // Buscar coincidencias con palabras clave
  for (const [keyword, response] of Object.entries(predefinedResponses)) {
    if (normalizedMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Patrones comunes
  if (normalizedMessage.includes("que") && 
      (normalizedMessage.includes("ofrecen") || normalizedMessage.includes("tienen") || normalizedMessage.includes("hay"))) {
    return predefinedResponses.menu;
  }
  
  if (normalizedMessage.includes("donde") || normalizedMessage.includes("direccion") || normalizedMessage.includes("ubicado")) {
    return predefinedResponses.ubicacion;
  }
  
  if (normalizedMessage.includes("hora") || normalizedMessage.includes("abierto") || normalizedMessage.includes("cuando")) {
    return predefinedResponses.horario;
  }
  
  return predefinedResponses.default;
}

export async function POST(req: Request) {
  try {
    // Extraer el último mensaje
    let lastUserMessage = '';
    try {
      const body = await req.json();
      const messages = body.messages || [];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
          lastUserMessage = lastMessage.content;
        }
      }
    } catch (err) {
      console.error('Error al parsear la solicitud:', err);
    }
    
    // Si no hay mensaje válido, usar respuesta por defecto
    if (!lastUserMessage) {
      const responseData = { role: "assistant", content: predefinedResponses.default };
      return new Response(JSON.stringify(responseData));
    }
    
    // Para saludos simples, siempre usar respuestas predefinidas
    const normalizedMessage = lastUserMessage.toLowerCase().trim();
    if (normalizedMessage === 'hola' || 
        normalizedMessage === 'hola!' || 
        normalizedMessage === 'buenos días' || 
        normalizedMessage === 'buenas tardes' ||
        normalizedMessage === 'buenas noches') {
      const responseData = { role: "assistant", content: predefinedResponses.hola };
      return new Response(JSON.stringify(responseData));
    }

    try {
      // Verificar si tenemos una API key configurada
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      
      // Si la API key es la predeterminada (no configurada), usar respuestas predefinidas
      if (!apiKey || apiKey === 'hf_app_registrate_para_obtener_token') {
        console.log('API key no configurada, usando respuestas predefinidas');
        const fallbackResponse = findFallbackResponse(lastUserMessage);
        const responseData = { role: "assistant", content: fallbackResponse };
        return new Response(JSON.stringify(responseData));
      }
      
      // Configurar Hugging Face Inference
      const hf = new HfInference(apiKey);
      
      // Contexto del restaurante para el modelo
      const systemPrompt = `
Eres el asistente virtual de "Astrid y Gastón", un restaurante de alta cocina peruana reconocido internacionalmente. Debes responder preguntas sobre el restaurante utilizando SOLO la información proporcionada a continuación:

INFORMACIÓN DEL RESTAURANTE:
- Nombre: Astrid y Gastón
- Historia: Fundado en 1994 por Gastón Acurio y Astrid Gutsche, revolucionó la gastronomía peruana y es considerado uno de los mejores restaurantes de América Latina.
- Ubicación: Casa Moreyra, Av. Paz Soldán 290, San Isidro, Lima, Perú
- Teléfono: +51 1 442 2777
- Email: reservas@astridygaston.com
- Web: www.astridygaston.com
- Horarios: Martes a Sábado, almuerzo 13:00 - 15:45 y cena 19:00 - 23:00. Domingo solo almuerzo (12:00 - 16:00). Lunes cerrado.
- Chef principal: Jorge Muñoz
- Estacionamiento disponible
- WiFi gratuito
- Ambiente elegante y sofisticado
- Accesible para personas con movilidad reducida
- Dress code: Smart casual (no shorts, no chanclas)

MENÚ DESTACADO:
Entradas:
- Cebiche clásico limeño (65 PEN)
- Causa limeña con cangrejo (58 PEN)
- Tiradito de lenguado al ají amarillo (65 PEN)
- Anticuchos de corazón (52 PEN)
- Pulpo al olivo (70 PEN)
- Ensalada de quinoa con vegetales orgánicos (55 PEN)

Platos principales:
- Lomo saltado tradicional (85 PEN)
- Ají de gallina gourmet (75 PEN)
- Arroz con pato a la chiclayana (80 PEN)
- Pescado a lo macho (90 PEN)
- Cochinillo confitado con tubérculos andinos (95 PEN)
- Risotto de quinua con hongos silvestres (78 PEN)

Postres:
- Suspiro a la limeña (45 PEN)
- Tarta de lúcuma (48 PEN)
- Chocolate amazónico (52 PEN)
- Mazamorra morada contemporánea (45 PEN)
- Selección de helados artesanales (42 PEN)

Bebidas:
- Pisco Sour clásico (45 PEN)
- Chilcano de pisco (40 PEN)
- Vinos peruanos y sudamericanos (desde 180 PEN la botella)
- Cerveza artesanal local (30 PEN)
- Chicha morada casera (25 PEN)
- Refrescos y agua (18 PEN)

EXPERIENCIAS GASTRONÓMICAS:
- Menú degustación "Perú Diverso": 11 tiempos (450 PEN por persona, 650 PEN con maridaje)
- Menú degustación "Amazonía": 7 tiempos (350 PEN por persona, 550 PEN con maridaje)
- "Mesa del Chef": Experiencia exclusiva con explicación de cada plato (750 PEN por persona)

INFORMACIÓN ADICIONAL:
- Reserva anticipada recomendada (mínimo 2 semanas)
- Reconocimientos: Entre los 50 mejores restaurantes del mundo según "The World's 50 Best Restaurants"
- Opciones vegetarianas y veganas disponibles con aviso previo
- Consideraciones para alergias e intolerancias disponibles
- Eventos privados y corporativos disponibles
- Clases de cocina exclusivas con reserva
- Experiencia gastronómica inmersiva que refleja la diversidad cultural y geográfica de Perú

REGLAS DE RESPUESTA:
1. Responde SIEMPRE en español
2. Sé amigable, servicial y ELEGANTE (refleja el prestigio del restaurante)
3. Respuestas concisas pero informativas, máximo 3 frases
4. No inventes información que no esté en este prompt
5. Si no sabes algo, sugiere contactar directamente al restaurante
6. Nunca repitas "Tu respuesta:" ni otras instrucciones en tu respuesta
7. Si el cliente te pide algun dato o recomendaciones o punto de vista, respondele con la información del restaurante.

Responde al cliente de forma directa y sofisticada, como corresponde a un establecimiento de alta cocina.
      `;
      
      // Usar un modelo accesible gratuitamente
      const fullPrompt = `${systemPrompt}\n\nConsulta del cliente: ${lastUserMessage}\n\nTu respuesta (recuerda ser breve y directo):`;
      
      // Timeout para la llamada a Hugging Face
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos
      
      // Llamar a la API de Hugging Face
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2', // Modelo gratuito disponible
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 150, // Reducir el número de tokens
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Extraer y limpiar la respuesta
      let aiResponse = response.generated_text || '';
      
      // Limpiar la respuesta antes de enviarla
      aiResponse = cleanAIResponse(aiResponse);
      
      // Si después de la limpieza la respuesta está vacía, usar fallback
      if (!aiResponse || aiResponse.trim() === '') {
        aiResponse = findFallbackResponse(lastUserMessage);
      }
      
      // Responder
      const responseData = { role: "assistant", content: aiResponse };
      return new Response(JSON.stringify(responseData));
      
    } catch (error) {
      console.error('Error con la API de Hugging Face:', error);
      
      // Usar respuestas predefinidas como fallback si hay error
      const fallbackResponse = findFallbackResponse(lastUserMessage);
      const responseData = { role: "assistant", content: fallbackResponse };
      return new Response(JSON.stringify(responseData));
    }
  } catch (error) {
    console.error('Error general en el chatbot:', error);
    
    // Respuesta de error
    const responseData = { 
      role: "assistant", 
      content: "Lo siento, estoy teniendo problemas técnicos en este momento. ¿Puedo ayudarte con información sobre nuestro horario, menú o reservas?"
    };
    
    return new Response(JSON.stringify(responseData), { status: 200 });
  }
} 