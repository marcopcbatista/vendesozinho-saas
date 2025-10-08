/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Desativa ESLint no build
  },
  webpack: (config) => {
    console.log('✅ Usando Webpack tradicional!');
    return config;
  },
};

module.exports = nextConfig;
