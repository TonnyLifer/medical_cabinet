<template>
  <div
    class="rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[120px]"
    :class="isActive ? 'bg-blue-600 text-white' : 'bg-white'"
    @click="$emit('click', item)"
  >
    <div class="text-center">
      <div 
        class="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center" 
        :class="isActive ? 'bg-white/20' : item.bgColor"
      >
        <span class="text-xl">{{ item.emoji }}</span>
      </div>
      <p class="text-xs font-medium" :class="isActive ? 'text-white' : 'text-gray-700'">
        {{ item.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  item: {
    id: string
    name: string
    emoji: string
    bgColor: string
  }
  isActive?: boolean
}

defineProps<Props>()
defineEmits<{
  click: [item: any]
}>()
</script>
