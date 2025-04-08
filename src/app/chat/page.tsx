"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Función simplificada para enviar mensajes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Limpiar input y mostrar estado de carga
    setInput('');
    setIsLoading(true);
    
    try {
      // Llamar a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Procesar respuesta
      const data = await response.json();
      
      // Agregar respuesta del asistente
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content 
      }]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Agregar mensaje de error como respuesta
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <header className="bg-amber-800 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">El Buen Sabor</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-amber-200 transition">Inicio</Link></li>
              <li><Link href="/reservas" className="hover:text-amber-200 transition">Reservas</Link></li>
              <li><Link href="/menu" className="hover:text-amber-200 transition">Menú</Link></li>
              <li><Link href="/contacto" className="hover:text-amber-200 transition">Contacto</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900">Asistente Virtual</h2>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-amber-700 hover:text-amber-900"
            >
              {showInfo ? 'Ocultar información' : 'Mostrar información'}
            </button>
          </div>

          {showInfo && (
            <div className="bg-amber-100 p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">¿Cómo puedo ayudarte?</h3>
              <p className="mb-2">Puedes preguntarme sobre:</p>
              <ul className="list-disc pl-5 space-y-1 text-amber-700">
                <li>Información del restaurante (horarios, ubicación)</li>
                <li>Ayuda con reservas</li>
                <li>Recomendaciones del menú</li>
                <li>Disponibilidad</li>
                <li>Y más...</li>
              </ul>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md border border-amber-200 h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-amber-700">
                  <p>¡Hola! Soy el asistente virtual de El Buen Sabor.</p>
                  <p className="mt-2">¿En qué puedo ayudarte hoy?</p>
                </div>
              ) : (
                messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-amber-100 text-amber-900 rounded-lg px-4 py-2 max-w-[80%]">
                    <span className="animate-pulse">Escribiendo...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-amber-200 p-4">
              <form onSubmit={handleSubmit} className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta aquí..."
                  className="text-black flex-1 px-4 py-2 border border-amber-300 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-r font-medium transition"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-amber-800">
              ¿Prefieres hacer una reserva directamente?{' '}
              <Link href="/reservas" className="text-amber-600 font-medium hover:underline">
                Ir al formulario de reservas
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-amber-900 text-amber-100 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 El Buen Sabor. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/terminos" className="hover:text-white transition">Términos y condiciones</Link>
              <Link href="/privacidad" className="hover:text-white transition">Política de privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 