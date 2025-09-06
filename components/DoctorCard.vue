<template>
  <div
    class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[160px]"
    @click="$emit('click', item)"
  >
    <div class="text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-3 flex items-center justify-center relative">
        <img 
          :src="item.avatar" 
          :alt="item.name"
          class="w-full h-full object-cover rounded-2xl"
        />
        <div v-if="item.isOnline" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <h3 class="font-semibold text-gray-900 text-sm mb-1">{{ item.shortName }}</h3>
      <p class="text-xs text-gray-600 mb-2">{{ item.speciality }}</p>
      <div class="flex items-center justify-center space-x-1 mb-2">
        <Icon name="heroicons:star" class="w-3 h-3 text-yellow-400 fill-current" />
        <span class="text-xs font-medium">{{ item.rating }}</span>
      </div>
      <p class="text-xs text-gray-500">Fee ${{ item.fee }}</p>
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
    rating: string
    fee: number
    isOnline?: boolean
  }
}

defineProps<Props>()
defineEmits<{
  click: [item: any]
}>()
</script>
