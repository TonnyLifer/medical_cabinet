<template>
  <div v-if="doctor">
    <!-- Хедер с фото врача -->
    <div class="relative">
      <div class="bg-gradient-to-br from-medical-500 to-medical-600 px-4 py-6 text-white">
        <div class="flex items-center space-x-3 mb-6">
          <UButton
            icon="heroicons:arrow-left"
            variant="ghost"
            color="white"
            @click="$router.back()"
          />
          <div class="flex-1" />
          <UButton
            :icon="isFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'"
            variant="ghost"
            color="white"
            @click="toggleFavorite"
          />
          <UButton
            icon="heroicons:share"
            variant="ghost"
            color="white"
            @click="shareDoctor"
          />
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
            <Icon name="heroicons:user" class="w-12 h-12 text-white" />
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold">{{ doctor.name }}</h1>
            <p class="text-medical-100 text-lg">{{ doctor.speciality }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:star" class="w-5 h-5 text-yellow-300 fill-current" />
                <span class="font-semibold">{{ doctor.rating }}</span>
                <span class="text-medical-100">({{ doctor.reviewsCount }})</span>
              </div>
              <div v-if="doctor.isOnline" class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-300 rounded-full"></div>
                <span class="text-sm">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Основная информация -->
    <div class="bg-white mx-4 -mt-4 rounded-2xl shadow-sm p-6 relative z-10">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-medical-600">{{ doctor.experience }}</p>
          <p class="text-sm text-gray-600">лет опыта</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-medical-600">{{ doctor.reviewsCount }}</p>
          <p class="text-sm text-gray-600">отзывов</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-medical-600">{{ doctor.price }}₽</p>
          <p class="text-sm text-gray-600">консультация</p>
        </div>
      </div>
    </div>

    <!-- Навигация по табам -->
    <div class="px-4 py-4">
      <div class="flex space-x-1 bg-gray-100 rounded-xl p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id 
            ? 'bg-white text-medical-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Контент табов -->
    <div class="px-4 pb-4">
      <!-- Обо мне -->
      <DoctorAbout v-show="activeTab === 'about'" :doctor="doctor" />

      <!-- Отзывы -->
      <DoctorReviews v-show="activeTab === 'reviews'" :reviews="reviews" />

      <!-- Расписание -->
      <DoctorSchedule 
        v-show="activeTab === 'schedule'" 
        :available-slots="doctor.availableSlots"
        :selected-slot="selectedSlot"
        @slot-select="selectSlot"
      />
    </div>

    <!-- Нижняя панель с кнопками -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div class="flex space-x-3">
        <UButton
          icon="heroicons:chat-bubble-left-right"
          variant="outline"
          class="flex-1"
          @click="startChat"
        >
          Чат
        </UButton>
        <UButton
          icon="heroicons:video-camera"
          variant="outline"
          class="flex-1"
          @click="startVideoCall"
          :disabled="!doctor.isOnline"
        >
          Видеозвонок
        </UButton>
        <UButton
          color="blue"
          class="flex-1"
          @click="bookAppointment"
        >
          Записаться
        </UButton>
      </div>
    </div>

    <!-- Модальное окно записи -->
    <UModal v-model="isBookingOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-6">Запись к врачу</h3>
        
        <div v-if="selectedSlot" class="mb-6 p-4 bg-medical-50 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ doctor.name }}</p>
              <p class="text-sm text-gray-600">{{ doctor.speciality }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ formatDate(selectedSlot.date) }}</p>
              <p class="text-sm text-gray-600">{{ selectedSlot.time }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Тип консультации
            </label>
            <div class="grid grid-cols-2 gap-3">
              <URadio
                v-model="consultationType"
                value="online"
                label="Онлайн"
                :disabled="!doctor.isOnline"
              />
              <URadio
                v-model="consultationType"
                value="offline"
                label="Очно"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Комментарий (необязательно)
            </label>
            <UTextarea
              v-model="appointmentNote"
              placeholder="Опишите ваши симптомы или вопросы..."
              rows="3"
            />
          </div>
        </div>

        <div class="flex space-x-3">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isBookingOpen = false"
          >
            Отмена
          </UButton>
          <UButton
            color="blue"
            class="flex-1"
            :loading="isBooking"
            @click="confirmBooking"
          >
            Подтвердить
          </UButton>
        </div>
      </div>
    </UModal>
  </div>

  <!-- Загрузка -->
  <div v-else class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
  </div>
</template>

<script setup lang="ts">
import type { Doctor, TimeSlot } from '~/types'

definePageMeta({
  title: 'Профиль врача'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const doctorId = route.params.id as string
const activeTab = ref('about')
const isFavorite = ref(false)
const isBookingOpen = ref(false)
const isBooking = ref(false)
const selectedSlot = ref<TimeSlot | null>(null)
const consultationType = ref('online')
const appointmentNote = ref('')

const tabs = [
  { id: 'about', name: 'Обо мне' },
  { id: 'reviews', name: 'Отзывы' },
  { id: 'schedule', name: 'Расписание' }
]

// Моковые данные врача
const doctor = ref<Doctor>({
  id: doctorId,
  name: 'Др. Иванова Анна Сергеевна',
  speciality: 'Кардиолог',
  rating: 4.9,
  reviewsCount: 247,
  experience: 15,
  price: 2500,
  about: 'Опытный кардиолог с международной сертификацией. Специализируюсь на диагностике и лечении сердечно-сосудистых заболеваний. Имею опыт работы в ведущих клиниках Европы. Провожу как очные, так и онлайн консультации.',
  education: [
    'МГУ им. М.В. Ломоносова, медицинский факультет',
    'Интернатура по кардиологии, НИИ кардиологии',
    'Стажировка в клинике Шарите, Берлин'
  ],
  availableSlots: [
    { id: '1', date: '2024-01-16', time: '14:00', isAvailable: true },
    { id: '2', date: '2024-01-16', time: '16:00', isAvailable: true },
    { id: '3', date: '2024-01-17', time: '10:00', isAvailable: true },
    { id: '4', date: '2024-01-17', time: '14:30', isAvailable: true },
    { id: '5', date: '2024-01-18', time: '11:00', isAvailable: true },
    { id: '6', date: '2024-01-18', time: '15:00', isAvailable: true }
  ],
  isOnline: true
})

const services = [
  { name: 'Первичная консультация', price: 2500, icon: 'heroicons:chat-bubble-left-right' },
  { name: 'Повторная консультация', price: 2000, icon: 'heroicons:arrow-path' },
  { name: 'Видеоконсультация', price: 2200, icon: 'heroicons:video-camera' },
  { name: 'Расшифровка ЭКГ', price: 1500, icon: 'heroicons:chart-bar' }
]

const reviews = [
  {
    id: '1',
    userName: 'Мария К.',
    rating: 5,
    comment: 'Отличный врач! Очень внимательна к пациентам, подробно объясняет диагноз и лечение.',
    date: '2024-01-10'
  },
  {
    id: '2',
    userName: 'Алексей П.',
    rating: 5,
    comment: 'Профессионал своего дела. Помогла разобраться с проблемами сердца.',
    date: '2024-01-08'
  },
  {
    id: '3',
    userName: 'Елена С.',
    rating: 4,
    comment: 'Хороший специалист, но запись очень сложная.',
    date: '2024-01-05'
  }
]

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  toast.add({
    title: isFavorite.value ? 'Добавлено в избранное' : 'Удалено из избранного',
    color: 'green'
  })
}

const shareDoctor = () => {
  if (navigator.share) {
    navigator.share({
      title: doctor.value?.name,
      text: `Рекомендую врача: ${doctor.value?.name} - ${doctor.value?.speciality}`,
      url: window.location.href
    })
  } else {
    toast.add({
      title: 'Ссылка скопирована',
      description: 'Поделитесь ссылкой на врача',
      color: 'green'
    })
  }
}

const selectSlot = (slot: TimeSlot) => {
  selectedSlot.value = slot
  activeTab.value = 'schedule'
}

const bookAppointment = () => {
  if (!selectedSlot.value) {
    toast.add({
      title: 'Выберите время',
      description: 'Перейдите в раздел "Расписание" и выберите удобное время',
      color: 'yellow'
    })
    activeTab.value = 'schedule'
    return
  }
  
  isBookingOpen.value = true
}

const confirmBooking = async () => {
  if (!selectedSlot.value) return
  
  isBooking.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      title: 'Запись успешна!',
      description: 'Подтверждение отправлено на ваш email',
      color: 'green'
    })
    
    isBookingOpen.value = false
    router.push('/appointments')
  } catch (error) {
    toast.add({
      title: 'Ошибка записи',
      description: 'Попробуйте еще раз или обратитесь в поддержку',
      color: 'red'
    })
  } finally {
    isBooking.value = false
  }
}

const startChat = () => {
  router.push(`/chat/${doctorId}`)
}

const startVideoCall = () => {
  if (!doctor.value?.isOnline) {
    toast.add({
      title: 'Врач не в сети',
      description: 'Видеозвонок недоступен',
      color: 'yellow'
    })
    return
  }
  
  router.push(`/video-call/${doctorId}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  })
}

// Устанавливаем заголовок страницы
useHead({
  title: computed(() => doctor.value?.name || 'Врач')
})
</script>
