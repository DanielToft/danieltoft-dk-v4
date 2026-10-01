// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://danieltoft.dk',
  // Astro's default 4321 is in a Windows excluded port range on the dev machine.
  server: { port: 5173 },
  integrations: [svelte()],
});
