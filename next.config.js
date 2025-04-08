/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la construcción
    dirs: ['pages', 'components', 'lib', 'app', 'src'], // Ignorar en todas las carpetas
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante la construcción
  },
  swcMinify: true,
}

module.exports = nextConfig 