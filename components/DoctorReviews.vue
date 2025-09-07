<template>
  <div class="space-y-4">
    <div
      v-for="review in reviews"
      :key="review.id"
      class="bg-white rounded-2xl p-6 shadow-sm"
    >
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
          <Icon name="heroicons:user" class="w-6 h-6 text-gray-500" />
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-900">{{ review.userName }}</h4>
            <div class="flex items-center space-x-1">
              <Icon 
                v-for="star in 5"
                :key="star"
                name="heroicons:star"
                class="w-4 h-4"
                :class="star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
              />
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-2">{{ review.comment }}</p>
          <p class="text-xs text-gray-400">{{ formatDate(review.date) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface Props {
  reviews: Review[]
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  })
}
</script>
