import Link from "next/link";

export default function Home() {
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

      <main className="container mx-auto py-16 px-4">
        <section className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-amber-900">Bienvenido a El Buen Sabor</h2>
            <p className="text-lg text-amber-800">Disfruta de una experiencia culinaria única en nuestro acogedor restaurante.</p>
            <div className="pt-4">
              <Link 
                href="/reservas" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
              >
                Reservar una mesa
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-amber-100 rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">¿Necesitas ayuda?</h3>
            <p className="mb-4">Nuestro asistente virtual está aquí para ayudarte con tus reservas y responder cualquier pregunta.</p>
            <Link 
              href="/chat" 
              className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium"
            >
              Hablar con nuestro asistente <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">Reserva fácil</h3>
            <p>Reserva tu mesa en pocos pasos a través de nuestro sistema online.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">Menú exquisito</h3>
            <p>Descubre nuestra amplia variedad de platos preparados con ingredientes frescos.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">Asistencia IA</h3>
            <p>Nuestro chatbot te ayudará con tus consultas y el proceso de reserva.</p>
          </div>
        </section>
      </main>

      <footer className="bg-amber-900 text-amber-100 py-8">
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
