<template>
  <div class="space-y-6">
    <!-- О враче -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h3 class="font-semibold text-gray-900 mb-3">О враче</h3>
      <p class="text-gray-600 leading-relaxed">{{ doctor.about }}</p>
    </div>

    <!-- Образование -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h3 class="font-semibold text-gray-900 mb-3">Образование</h3>
      <div class="space-y-2">
        <div
          v-for="edu in doctor.education"
          :key="edu"
          class="flex items-center space-x-3"
        >
          <Icon name="heroicons:academic-cap" class="w-5 h-5 text-medical-500" />
          <span class="text-gray-600">{{ edu }}</span>
        </div>
      </div>
    </div>

    <!-- Услуги -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h3 class="font-semibold text-gray-900 mb-3">Услуги</h3>
      <div class="space-y-3">
        <div
          v-for="service in services"
          :key="service.name"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
        >
          <div class="flex items-center space-x-3">
            <Icon :name="service.icon" class="w-5 h-5 text-medical-500" />
            <span class="font-medium">{{ service.name }}</span>
          </div>
          <span class="text-medical-600 font-semibold">{{ service.price }}₽</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Doctor } from '~/types'

interface Props {
  doctor: Doctor
}

defineProps<Props>()

const services = [
  { name: 'Первичная консультация', price: 2500, icon: 'heroicons:chat-bubble-left-right' },
  { name: 'Повторная консультация', price: 2000, icon: 'heroicons:arrow-path' },
  { name: 'Видеоконсультация', price: 2200, icon: 'heroicons:video-camera' },
  { name: 'Расшифровка ЭКГ', price: 1500, icon: 'heroicons:chart-bar' }
]
</script>
