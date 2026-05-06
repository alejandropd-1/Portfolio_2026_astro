// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${path.resolve(__dirname, './src/styles/abstracts').replace(/\\/g, '/')}" as *;`
        }
      }
    }
  }
});