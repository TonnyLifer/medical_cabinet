<template>
  <div id="app" class="light">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Мета теги для SEO
useHead({
  titleTemplate: 'Komir - Медицинская платформа',
  meta: [
    { name: 'description', content: 'Современная медицинская платформа для связи с врачами' },
    { name: 'theme-color', content: '#0085FE' }
  ],
  htmlAttrs: {
    class: 'light'
  }
})

// Глобальные стили
useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Komir',
  twitterCard: 'summary_large_image'
})

// Принудительно устанавливаем светлую тему
onMounted(() => {
  if (process.client) {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
