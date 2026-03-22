import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['m.media-amazon.com', 'images-na.ssl-images-amazon.com'],
  },
});
