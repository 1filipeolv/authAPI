const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname), // raiz do projeto
      '@/components': path.resolve(__dirname, 'frontend/src/components'),
      '@/context': path.resolve(__dirname, 'context'),
    };
    return config;
  },
};

module.exports = nextConfig;
