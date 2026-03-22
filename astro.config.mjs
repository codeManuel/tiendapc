import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  // 1. Añade aquí tu futura URL (ejemplo de Vercel) para que el SEO sea válido
  site: 'https://tu-tienda-laptops.github.io',

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ['m.media-amazon.com', 'images-na.ssl-images-amazon.com'],
  },

  integrations: [sitemap()],
});