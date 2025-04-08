"use client";

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function Reservas() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: '2',
    mensaje: '',
    ocasion: 'normal'
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de reserva:', formData);
    // Aquí iría la lógica para enviar los datos a la API
    setSubmitted(true);
  };

  // Horarios de Astrid y Gastón
  const horasAlmuerzo = ['12:30', '13:00', '13:30', '14:00', '14:30', '15:00'];
  const horasCena = ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
  
  // Determinar las horas disponibles según la fecha
  const getHorasDisponibles = () => {
    // Si no hay fecha seleccionada, mostrar todas las horas
    if (!formData.fecha) return [...horasAlmuerzo, ...horasCena];
    
    // Determinar si es domingo (solo almuerzo)
    const fechaSeleccionada = new Date(formData.fecha);
    const esDomingo = fechaSeleccionada.getDay() === 0;
    
    return esDomingo ? horasAlmuerzo : [...horasAlmuerzo, ...horasCena];
  };

  // Opciones de ocasiones especiales
  const ocasiones = [
    { value: 'normal', label: 'Visita regular' },
    { value: 'cumpleanos', label: 'Cumpleaños' },
    { value: 'aniversario', label: 'Aniversario' },
    { value: 'negocio', label: 'Reunión de negocios' },
    { value: 'otro', label: 'Otra celebración' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <header className="bg-amber-900 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Astrid y Gastón</h1>
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

      <main className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">Reserva tu experiencia gastronómica</h2>
          
          {submitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
              <h3 className="font-bold text-xl mb-2">¡Reserva recibida!</h3>
              <p>Gracias por tu reserva en Astrid y Gastón. Te hemos enviado un correo de confirmación a {formData.email}.</p>
              <p className="mt-2">Un miembro de nuestro equipo se pondrá en contacto contigo para confirmar tu reserva en breve.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
              >
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="nombre" className="block text-amber-800 font-medium mb-2">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-amber-800 font-medium mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="telefono" className="block text-amber-800 font-medium mb-2">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="personas" className="block text-amber-800 font-medium mb-2">Número de personas</label>
                  <select
                    id="personas"
                    name="personas"
                    value={formData.personas}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
                    ))}
                    <option value="9+">Más de 8 personas</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fecha" className="block text-amber-800 font-medium mb-2">Fecha</label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="hora" className="block text-amber-800 font-medium mb-2">Hora</label>
                  <select
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Seleccionar hora</option>
                    <optgroup label="Almuerzo">
                      {horasAlmuerzo.map(hora => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </optgroup>
                    {(!formData.fecha || new Date(formData.fecha).getDay() !== 0) && (
                      <optgroup label="Cena">
                        {horasCena.map(hora => (
                          <option key={hora} value={hora}>{hora}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="ocasion" className="block text-amber-800 font-medium mb-2">Ocasión</label>
                  <select
                    id="ocasion"
                    name="ocasion"
                    value={formData.ocasion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {ocasiones.map(opcion => (
                      <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-amber-800 font-medium mb-2">Experiencias gastronómicas</label>
                  <div className="mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experiencia"
                          id="normal"
                          value="normal"
                          className="mr-2"
                          defaultChecked
                        />
                        <label htmlFor="normal">Carta Regular</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experiencia"
                          id="peru-diverso"
                          value="peru-diverso"
                          className="mr-2"
                        />
                        <label htmlFor="peru-diverso">Menú &quot;Perú Diverso&quot; (450 PEN)</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="experiencia"
                          id="amazonia"
                          value="amazonia"
                          className="mr-2"
                        />
                        <label htmlFor="amazonia">Menú &quot;Amazonía&quot; (350 PEN)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="mensaje" className="block text-amber-800 font-medium mb-2">Solicitudes especiales</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Alergias, preferencias de ubicación, intolerancias alimentarias, etc."
                ></textarea>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                >
                  Confirmar reserva
                </button>
                <Link 
                  href="/chat" 
                  className="text-amber-700 hover:text-amber-900 font-medium"
                >
                  ¿Necesitas ayuda? Habla con nuestro asistente
                </Link>
              </div>
            </form>
          )}
          
          <div className="mt-12 bg-amber-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Información importante</h3>
            <ul className="space-y-3">
              <li>• Las reservas deben realizarse con al menos 2 semanas de antelación para garantizar disponibilidad.</li>
              <li>• Para grupos de más de 8 personas, por favor contáctanos directamente al +51 1 442 2777.</li>
              <li>• Para la &quot;Mesa del Chef&quot; (experiencia exclusiva), es necesario hacer reserva telefónica.</li>
              <li>• Dress code: Smart casual (no se permiten shorts ni chanclas).</li>
              <li>• Se aplicará un cargo del 50% del valor por cancelaciones con menos de 48 horas de antelación.</li>
              <li>• Para solicitudes dietéticas especiales, por favor especificar en el formulario o contactar con antelación.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-amber-900 text-amber-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Astrid y Gastón. Todos los derechos reservados.</p>
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