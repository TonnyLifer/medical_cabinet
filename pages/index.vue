<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 to-white">
    <!-- Приветствие пользователя -->
    <section class="px-4 py-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">
            Привет, {{ userName }}! 👋
          </h1>
          <p class="text-gray-600 mt-1">
            Chandpur, BD
          </p>
        </div>
        <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face" 
            alt="Profile" 
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Поисковая строка -->
    <section class="px-4 py-4">
      <SearchBar @open-search="openSearch" />
    </section>


    <!-- Главный баннер с иллюстрацией -->
    <section class="px-4 py-4">
      <div class="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl p-6 text-white relative overflow-hidden">
        <div class="flex items-center justify-between relative z-10">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <Icon name="heroicons:plus" class="w-6 h-6 mr-2" />
            </div>
            <h3 class="text-lg font-bold mb-2">
              Заботьтесь о своём здоровье
            </h3>
            <p class="text-blue-100 mb-4 text-sm">
              Заполните медицинскую карту прямо сейчас
            </p>
            <UButton
              color="white"
              variant="solid"
              size="sm"
              class="bg-white text-blue-600 hover:bg-blue-50"
              @click="$router.push('/doctors')"
            >
              Заказать сейчас
            </UButton>
          </div>
          <div class="ml-4 relative">
            <!-- Медицинская иллюстрация -->
            <div class="w-24 h-24 relative">
              <div class="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Icon name="heroicons:user-group" class="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Icon name="heroicons:plus" class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        <!-- Декоративные элементы -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
      </div>
    </section>

    <!-- Быстрые сервисы -->
    <section class="px-4 py-5">
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="service in quickServices"
          :key="service.name"
          class="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
          @click="handleQuickAction(service)"
        >
          <div class="w-12 h-12 rounded-2xl mb-2 flex items-center justify-center" :class="service.bgColor">
            <Icon :name="service.icon" class="w-6 h-6" :class="service.iconColor" />
          </div>
          <span class="text-xs font-medium text-gray-700 text-center leading-tight">{{ service.name }}</span>
        </div>
      </div>
    </section>

    <!-- Категории специалистов -->
    <section class="px-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">
          Специалисты
        </h2>
        <UButton
          variant="ghost"
          size="sm"
          class="view-all-button text-green-500 font-semibold hover:text-green-600 hover:bg-gray-50"
          @click="$router.push('/doctors')"
        >
          Посмотреть все
        </UButton>
      </div>
      
      <AppSwiper
        :items="popularSpecialties"
        :slides-per-view="3"
        :space-between="12"
        class="pb-2"
      >
        <template #default="{ item }">
          <SpecialtyCard
            :item="item"
            @click="handleSpecialtyClick"
          />
        </template>
      </AppSwiper>
    </section>

    <!-- Доступные врачи -->
    <section class="px-4 py-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">
          Доступные врачи
        </h2>
        <UButton
          variant="ghost"
          size="sm"
          class="view-all-button text-green-500 font-semibold hover:text-green-600 hover:bg-gray-50"
          @click="$router.push('/doctors')"
        >
          Посмотреть все
        </UButton>
      </div>
      
      <div class="py-2">
        <AppSwiper
          :items="topDoctors"
          :slides-per-view="2"
          :space-between="12"
          class="pb-4"
        >
        <template #default="{ item }">
          <DoctorCard
            :item="item"
            @click="handleDoctorClick"
          />
        </template>
        </AppSwiper>
      </div>
    </section>

    <!-- Топ врачи -->
    <section class="px-4 py-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">
          Топ врачи
        </h2>
        <UButton
          variant="ghost"
          size="sm"
          class="view-all-button text-green-500 font-semibold hover:text-green-600 hover:bg-gray-50"
          @click="$router.push('/doctors')"
        >
          Посмотреть все
        </UButton>
      </div>
      
      <div class="space-y-3">
        <div
          v-for="doctor in featuredDoctors"
          :key="doctor.id"
          class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
          @click="$router.push(`/doctors/${doctor.id}`)"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
              <img 
                :src="doctor.avatar" 
                :alt="doctor.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ doctor.name }}</h3>
              <p class="text-sm text-gray-600">{{ doctor.clinic }}</p>
              <div class="flex items-center mt-1">
                <div v-if="doctor.status === 'online'" class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-xs text-green-600 font-medium">Online</span>
                </div>
                <div v-else class="flex items-center">
                  <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span class="text-xs text-red-600 font-medium">Offline</span>
                </div>
                <div class="flex items-center ml-4">
                  <Icon name="heroicons:star" class="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  <span class="text-xs font-medium">({{ doctor.rating }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Недавно просмотренные -->
    <section class="px-4 py-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">
          Недавно просмотренные
        </h2>
        <UButton
          variant="ghost"
          size="sm"
          class="view-all-button text-green-500 font-semibold hover:text-green-600 hover:bg-gray-50"
          @click="$router.push('/doctors')"
        >
          Посмотреть все
        </UButton>
      </div>
      
      <AppSwiper
        :items="recentlyViewed"
        :slides-per-view="2.5"
        :space-between="16"
        class="pb-2"
      >
        <template #default="{ item }">
          <RecentDoctorCard
            :item="item"
            @click="handleDoctorClick"
          />
        </template>
      </AppSwiper>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Doctor, Appointment, Specialty } from '~/types'

definePageMeta({
  title: 'Главная'
})

const router = useRouter()
const toast = useToast()

const userName = ref('mosarraf')

const quickServices = [
  {
    name: 'Врачи',
    icon: 'heroicons:user-group',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    action: 'find-doctor'
  },
  {
    name: 'Аптеки',
    icon: 'heroicons:beaker',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    action: 'pharmacies'
  },
  {
    name: 'Больницы',
    icon: 'heroicons:building-office-2',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    action: 'hospitals'
  },
  {
    name: 'Больше',
    icon: 'heroicons:squares-2x2',
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    action: 'more'
  }
]

const popularSpecialties: Specialty[] = [
  {
    id: '1',
    name: 'Кардиолог',
    icon: '',
    description: 'Heart specialist',
    doctorsCount: 156,
    emoji: '❤️',
    bgColor: 'bg-blue-100'
  },
  {
    id: '2',
    name: 'Стоматолог',
    icon: '',
    description: 'Dental care',
    doctorsCount: 89,
    emoji: '🦷',
    bgColor: 'bg-pink-100'
  },
  {
    id: '3',
    name: 'Терапевт',
    icon: '',
    description: 'Lab specialist',
    doctorsCount: 67,
    emoji: '🔬',
    bgColor: 'bg-green-100'
  },
  {
    id: '4',
    name: 'Невролог',
    icon: '',
    description: 'Neurology specialist',
    doctorsCount: 67,
    emoji: '🧠',
    bgColor: 'bg-purple-100'
  },
  {
    id: '5',
    name: 'Дерматолог',
    icon: '',
    description: 'Dermatology specialist',
    doctorsCount: 67,
    emoji: '👩‍⚕️',
    bgColor: 'bg-pink-100'
  },
  {
    id: '6',
    name: 'Педиатр',
    icon: '',
    description: 'Pediatrician',
    doctorsCount: 67,
    emoji: '👶',
    bgColor: 'bg-orange-100'
  },
  {
    id: '7',
    name: 'Гинеколог',
    icon: '',
    description: 'Gynecologist',
    doctorsCount: 67,
    emoji: '👩‍⚕️',
    bgColor: 'bg-pink-100'
  },
  {
    id: '8',
    name: 'Офтальмолог',
    icon: '',
    description: 'Ophthalmologist',
    doctorsCount: 67,
    emoji: '👁️',
    bgColor: 'bg-blue-100'
  },
  {
    id: '9',
    name: 'ЛОР',
    icon: '',
    description: 'LOR',
    doctorsCount: 67,
    emoji: '👃',
    bgColor: 'bg-purple-100'
  }
]

const topDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Karuk',
    shortName: 'Dr. Karuk',
    speciality: 'Neurology',
    rating: 4.9,
    reviewsCount: 247,
    experience: 15,
    price: 2500,
    fee: 15,
    about: 'Experienced neurologist',
    education: [],
    availableSlots: [],
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dr. John',
    shortName: 'Dr. John',
    speciality: 'Physiotherapy',
    rating: 5.0,
    reviewsCount: 189,
    experience: 12,
    price: 2000,
    fee: 15,
    about: 'Physical therapy specialist',
    education: [],
    availableSlots: [],
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Dr. Karuk',
    shortName: 'Dr. Karuk',
    speciality: 'Neurology',
    rating: 4.9,
    reviewsCount: 156,
    experience: 18,
    price: 3000,
    fee: 15,
    about: 'Neurology specialist',
    education: [],
    availableSlots: [],
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  }
]

const featuredDoctors = [
  {
    id: '1',
    name: 'Dr. John',
    clinic: 'Dhaka medical(Neur specialist)',
    status: 'online',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dr. Karuk',
    clinic: 'Dhaka medical(Neur specialist)',
    status: 'offline',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Dr. Erann',
    clinic: 'Dhaka medical(Neur specialist)',
    status: 'online',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  }
]

const recentlyViewed = [
  {
    id: '1',
    name: 'Dr. Karuk',
    shortName: 'Dr. Karuk',
    speciality: 'Neurology',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dr. Erann',
    shortName: 'Dr. Erann',
    speciality: 'Physiotherapy',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Dr. Karuk',
    shortName: 'Dr. Karuk',
    speciality: 'Neurology',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  }
]

const handleQuickAction = (action: any) => {
  switch (action.action) {
    case 'find-doctor':
      router.push('/doctors')
      break
    case 'pharmacies':
      router.push('/pharmacies')
      break
    case 'hospitals':
      toast.add({
        title: 'В разработке',
        description: 'Функция скоро будет доступна',
        color: 'yellow'
      })
      break
    case 'more':
      toast.add({
        title: 'Больше услуг',
        description: 'Дополнительные функции скоро будут доступны',
        color: 'blue'
      })
      break
  }
}

const openSearch = () => {
  // Эмитим событие для открытия поиска в layout
  const event = new CustomEvent('open-search')
  window.dispatchEvent(event)
}

const handleSpecialtyClick = (item: any) => {
  navigateTo(`/doctors?specialty=${item.name}`)
}

const handleDoctorClick = (item: any) => {
  navigateTo(`/doctors/${item.id}`)
}
</script>
