<template>
  <div class="relative">
    <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Найдите своего врача..."
      class="w-full bg-white border border-gray-200 rounded-xl px-12 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
      @focus="openSearch"
    />
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'open-search'): void
}

const emit = defineEmits<Emits>()
const searchQuery = ref('')

const openSearch = () => {
  emit('open-search')
}
</script>
