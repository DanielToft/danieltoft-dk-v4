// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://danieltoft.dk',
  // Astro's default 4321 is in a Windows excluded port range on the dev machine.
  server: { port: 5173 },
  integrations: [svelte()],
  build: {
    // One page and ~22 kB of CSS: inlining beats a render-blocking request.
    inlineStylesheets: 'always',
  },
  // Self-hosted via the Fonts API: preload links plus metric-matched fallbacks, so the swap doesn't shift layout.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-sans',
      weights: ['300 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Cascadia Code',
      cssVariable: '--font-mono',
      weights: ['200 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'Consolas', 'monospace'],
    },
  ],
});
