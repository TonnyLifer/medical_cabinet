<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Убираем заголовок и навигацию для auth страниц
definePageMeta({
  layout: false
})
</script>
