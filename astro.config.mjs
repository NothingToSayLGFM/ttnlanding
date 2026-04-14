import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://ttnflow.com',
  integrations: [
    tailwind({ configFile: './tailwind.config.cjs' }),
    vue(),
  ],
  output: 'static',
});
