<template>
  <div
    class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[140px]"
    @click="$emit('click', item)"
  >
    <div class="text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-3 overflow-hidden">
        <img 
          :src="item.avatar" 
          :alt="item.name"
          class="w-full h-full object-cover"
        />
      </div>
      <h3 class="font-semibold text-gray-900 text-sm mb-1">{{ item.shortName }}</h3>
      <p class="text-xs text-gray-600">{{ item.speciality }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  item: {
    id: string
    name: string
    shortName: string
    speciality: string
    avatar: string
  }
}

defineProps<Props>()
defineEmits<{
  click: [item: any]
}>()
</script>
