<template>
  <div id="app">
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
  ]
})

// Глобальные стили
useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Komir',
  twitterCard: 'summary_large_image'
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
