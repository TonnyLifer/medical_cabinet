<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
    <!-- Заголовок -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Избранное</h1>
      
      <!-- Избранные врачи -->
      <div v-if="favoriteDoctors.length > 0" class="space-y-4">
        <div
          v-for="doctor in favoriteDoctors"
          :key="doctor.id"
          class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
          @click="$router.push(`/doctors/${doctor.id}`)"
        >
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
              <img 
                :src="doctor.avatar" 
                :alt="doctor.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ doctor.name }}</h3>
              <p class="text-sm text-gray-600">{{ doctor.speciality }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm font-medium">{{ doctor.rating }}</span>
                  <span class="text-sm text-gray-500">({{ doctor.reviewsCount }})</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:banknotes" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-600">от {{ doctor.price }}₽</span>
                </div>
              </div>
            </div>
            <UButton
              icon="heroicons:heart"
              variant="ghost"
              color="red"
              size="sm"
              @click.stop="removeFromFavorites(doctor.id)"
            />
          </div>
        </div>
      </div>
      
      <!-- Пустое состояние -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Icon name="heroicons:heart" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Нет избранных врачей</h3>
        <p class="text-gray-600 mb-6">Добавьте врачей в избранное для быстрого доступа</p>
        <UButton
          @click="$router.push('/doctors')"
        >
          Найти врачей
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Doctor } from '~/types'

definePageMeta({
  title: 'Избранное'
})

const toast = useToast()

// Заглушка избранных врачей
const favoriteDoctors = ref<Doctor[]>([
  {
    id: '1',
    name: 'Dr. Иванова Анна',
    speciality: 'Кардиолог',
    rating: 4.9,
    reviewsCount: 247,
    experience: 15,
    price: 2500,
    about: 'Опытный кардиолог',
    education: [],
    availableSlots: [],
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1594824388665-9dc0c264f1c5?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dr. Петров Сергей',
    speciality: 'Терапевт',
    rating: 4.8,
    reviewsCount: 189,
    experience: 12,
    price: 2000,
    about: 'Врач общей практики',
    education: [],
    availableSlots: [],
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  }
])

const removeFromFavorites = (doctorId: string) => {
  favoriteDoctors.value = favoriteDoctors.value.filter(doctor => doctor.id !== doctorId)
  toast.add({
    title: 'Удалено из избранного',
    description: 'Врач удален из списка избранных',
    color: 'yellow'
  })
}
</script>
