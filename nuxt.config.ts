export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  ui: {
    global: true,
    icons: ['heroicons', 'lucide', 'material-symbols']
  },

  css: [
    '~/assets/css/main.css',
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination',
    'swiper/css/free-mode'
  ],

  components: [
    {
      path: '~/components',
      global: true
    }
  ],

  app: {
    head: {
      title: 'Комир - Медицинская платформа',
      meta: [
        { name: 'description', content: 'Современная платформа для связи с врачами и медицинскими услугами' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001'
    }
  },

  typescript: {
    strict: false,
    typeCheck: false
  }
})
