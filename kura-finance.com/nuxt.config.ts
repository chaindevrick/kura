export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2026-04-18',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/css/globals.css'],
  app: {
    head: {
      title: 'Kura Finance - Unified Wealth Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Unify your Web3 & Fiat finances in one dashboard. Real-time analytics, automated tracking, and enterprise-grade security for modern investors.' },
        { name: 'theme-color', content: '#0b0c10' },
        { name: 'msapplication-TileColor', content: '#0b0c10' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Kura Finance' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'mask-icon', href: '/favicon.svg', color: '#18a058' }
      ]
    }
  },
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    viewer: false,
  },
  devtools: { enabled: false }
});
