// @ts-check

import { defineConfig, fontProviders } from 'astro/config';

import vue from '@astrojs/vue';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), sitemap()],
  site: "https://pz2-metawishlist.maarten494.workers.dev/",
  fonts: [{
      provider: fontProviders.local(),
      name: "EagleBold",
      cssVariable: "--font-eagle-bold",
      fallbacks: ["sans-serif"],
      options: {
        variants: [{
          src: ['./src/assets/fonts/EagleBold.ttf'],
          weight: 'normal',
          style: 'normal'
        }]
      }
    },
    {
      provider: fontProviders.local(),
      name: "NotoSans",
      cssVariable: "--font-noto-sans",
      fallbacks: ["sans-serif"],
      options: {
        variants: [{
          src: ['./src/assets/fonts/NotoSans-VariableFont_wdth,wght.ttf'],
          weight: 'normal, 600, 700, 800',
          style: 'normal'
        }]
      }
    }],

  adapter: cloudflare(),
});
