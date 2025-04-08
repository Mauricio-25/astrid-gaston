# Astrid y Gastón - Website con Chatbot IA

Sitio web para el prestigioso restaurante Astrid y Gastón, con sistema de reservas y chatbot de inteligencia artificial.

![Astrid y Gastón](https://astridygaston.com/wp-content/uploads/2020/05/2-1024x768.jpg)

## Características

- Página de inicio con información del restaurante
- Sistema de reservas online
- Chatbot de IA con Hugging Face Inference API
- Diseño responsive y elegante
- Integración con base de datos (Falta)

## Tecnologías utilizadas

- [Next.js 15](https://nextjs.org/) - Framework de React
- [React](https://reactjs.org/) - Biblioteca para interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Hugging Face](https://huggingface.co/) - API de IA para el chatbot
- [Mistral 7B](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) - Modelo de lenguaje para el chatbot

## Requisitos previos

- Node.js (versión 18 o superior)
- Cuenta en Hugging Face con token de API

## Instalación

1. Clona este repositorio
   ```bash
   git clone <url-del-repositorio>
   cd astrid-y-gaston
   ```

2. Instala las dependencias
   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` con las siguientes variables:
   ```
   HUGGINGFACE_API_KEY=tu_token_de_huggingface
   NEXT_PUBLIC_RESTAURANT_NAME="Astrid y Gastón"
   NEXT_PUBLIC_RESTAURANT_ADDRESS="Casa Moreyra, Av. Paz Soldán 290, San Isidro, Lima, Perú"
   NEXT_PUBLIC_RESTAURANT_PHONE="+51 1 442 2777"
   NEXT_PUBLIC_RESTAURANT_EMAIL="reservas@astridygaston.com"
   NEXT_PUBLIC_RESTAURANT_WEBSITE="www.astridygaston.com"
   ```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Navega a `http://localhost:3000` para ver la aplicación.

## Estructura del proyecto

- `src/app/page.tsx`: Página de inicio
- `src/app/reservas/page.tsx`: Formulario de reservas
- `src/app/chat/page.tsx`: Interfaz del chatbot
- `src/app/api/chat/route.ts`: API que conecta con Hugging Face

## Construcción para producción

```bash
npm run build
```


## Personalización del chatbot

Puedes modificar el contexto y comportamiento del chatbot editando el archivo `src/app/api/chat/route.ts`.

