import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tu-tienda-laptops.vercel.app',
  integrations: [sitemap()],
  server: {
    port: 4321,
    strictPort: true, // Evita que salte a otro puerto si este falla
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 4321, // Forzamos el HMR al mismo puerto de Astro
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Permitimos que Vite responda correctamente a las peticiones del cliente
      allowedHosts: true 
    }
  },
  image: {
    domains: ['m.media-amazon.com', 'images-na.ssl-images-amazon.com'],
  },
});
