/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la construcción
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante la construcción
  },
}

module.exports = nextConfig 