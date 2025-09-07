<template>
  <div>
    <!-- Хедер -->
    <div class="bg-white px-4 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">Мои записи</h1>
        <UButton
          icon="heroicons:plus"
          color="blue"
          @click="$router.push('/doctors')"
        >
          Записаться
        </UButton>
      </div>
    </div>

    <!-- Фильтры по статусу -->
    <FilterSwiperApp
      :filters="statusFiltersWithCount"
      :active-filter="activeStatusFilter"
      @filter-change="activeStatusFilter = $event"
    />

    <!-- Список записей -->
    <div class="px-4 py-4 space-y-4">
      <div
        v-for="appointment in filteredAppointments"
        :key="appointment.id"
        class="bg-white rounded-2xl p-4 shadow-sm border-l-4 transition-all hover:shadow-md"
        :class="getAppointmentBorderColor(appointment.status)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:user" class="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-lg">{{ appointment.doctor.name }}</h3>
              <p class="text-medical-600">{{ appointment.doctor.speciality }}</p>
              <div class="flex items-center space-x-1 mt-1">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 fill-current" />
                <span class="text-sm font-medium">{{ appointment.doctor.rating }}</span>
              </div>
            </div>
          </div>
          <UBadge
            :label="getAppointmentStatusText(appointment.status)"
            :color="getAppointmentStatusColor(appointment.status)"
          />
        </div>

        <!-- Детали записи -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:calendar-days" class="w-5 h-5 text-gray-400" />
            <div>
              <p class="text-sm text-gray-600">Дата</p>
              <p class="font-medium">{{ formatDate(appointment.date) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:clock" class="w-5 h-5 text-gray-400" />
            <div>
              <p class="text-sm text-gray-600">Время</p>
              <p class="font-medium">{{ appointment.time }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Icon 
              :name="appointment.type === 'online' ? 'heroicons:video-camera' : 'heroicons:building-office'"
              class="w-5 h-5 text-gray-400" 
            />
            <div>
              <p class="text-sm text-gray-600">Тип</p>
              <p class="font-medium">{{ appointment.type === 'online' ? 'Онлайн' : 'Очно' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:banknotes" class="w-5 h-5 text-gray-400" />
            <div>
              <p class="text-sm text-gray-600">Стоимость</p>
              <p class="font-medium">{{ appointment.doctor.price }}₽</p>
            </div>
          </div>
        </div>

        <!-- Заметки -->
        <div v-if="appointment.notes" class="mb-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">
            <Icon name="heroicons:chat-bubble-left" class="w-4 h-4 inline mr-1" />
            {{ appointment.notes }}
          </p>
        </div>

        <!-- Действия -->
        <div class="flex space-x-2">
          <!-- Кнопки в зависимости от статуса -->
          <template v-if="appointment.status === 'pending'">
            <UButton
              variant="outline"
              size="sm"
              @click="cancelAppointment(appointment)"
            >
              Отменить
            </UButton>
            <UButton
              variant="outline"
              size="sm"
              @click="rescheduleAppointment(appointment)"
            >
              Перенести
            </UButton>
          </template>

          <template v-if="appointment.status === 'confirmed'">
            <UButton
              v-if="appointment.type === 'online'"
              color="green"
              size="sm"
              @click="joinVideoCall(appointment)"
              :disabled="!canJoinCall(appointment)"
            >
              {{ canJoinCall(appointment) ? 'Подключиться' : 'Ожидание' }}
            </UButton>
            <UButton
              variant="outline"
              size="sm"
              @click="openChat(appointment)"
            >
              Чат
            </UButton>
            <UButton
              variant="outline"
              size="sm"
              @click="cancelAppointment(appointment)"
            >
              Отменить
            </UButton>
          </template>

          <template v-if="appointment.status === 'completed'">
            <UButton
              variant="outline"
              size="sm"
              @click="writeReview(appointment)"
            >
              Оставить отзыв
            </UButton>
            <UButton
              variant="outline"
              size="sm"
              @click="bookAgain(appointment)"
            >
              Записаться снова
            </UButton>
          </template>

          <template v-if="appointment.status === 'cancelled'">
            <UButton
              color="blue"
              size="sm"
              @click="bookAgain(appointment)"
            >
              Записаться снова
            </UButton>
          </template>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="filteredAppointments.length === 0" class="text-center py-12">
        <Icon name="heroicons:calendar-days" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ getEmptyStateTitle() }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ getEmptyStateDescription() }}
        </p>
        <UButton
          color="blue"
          @click="$router.push('/doctors')"
        >
          Найти врача
        </UButton>
      </div>
    </div>

    <!-- Модальное окно отмены -->
    <UModal v-model="isCancelModalOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Отмена записи</h3>
        <p class="text-gray-600 mb-6">
          Вы уверены, что хотите отменить запись к {{ selectedAppointment?.doctor.name }}?
        </p>
        <div class="flex space-x-3">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isCancelModalOpen = false"
          >
            Нет, оставить
          </UButton>
          <UButton
            color="red"
            class="flex-1"
            :loading="isCancelling"
            @click="confirmCancel"
          >
            Да, отменить
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Модальное окно отзыва -->
    <UModal v-model="isReviewModalOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Оценить врача</h3>
        
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-gray-200 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <Icon name="heroicons:user" class="w-10 h-10 text-gray-500" />
          </div>
          <h4 class="font-medium">{{ selectedAppointment?.doctor.name }}</h4>
          <p class="text-sm text-gray-600">{{ selectedAppointment?.doctor.speciality }}</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Оценка
            </label>
            <div class="flex justify-center space-x-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="reviewRating = star"
                class="p-1"
              >
                <Icon 
                  name="heroicons:star"
                  class="w-8 h-8"
                  :class="star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Комментарий
            </label>
            <UTextarea
              v-model="reviewComment"
              placeholder="Поделитесь впечатлениями о приеме..."
              rows="4"
            />
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isReviewModalOpen = false"
          >
            Отмена
          </UButton>
          <UButton
            color="blue"
            class="flex-1"
            :loading="isSubmittingReview"
            :disabled="reviewRating === 0"
            @click="submitReview"
          >
            Отправить
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types'

definePageMeta({
  title: 'Мои записи'
})

const router = useRouter()
const toast = useToast()

const activeStatusFilter = ref('all')
const isCancelModalOpen = ref(false)
const isReviewModalOpen = ref(false)
const isCancelling = ref(false)
const isSubmittingReview = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const reviewRating = ref(0)
const reviewComment = ref('')

const statusFiltersWithCount = computed(() => {
  return statusFilters.map(filter => ({
    ...filter,
    count: getCountByStatus(filter.value)
  }))
})

const statusFilters = [
  { label: 'Все', value: 'all' },
  { label: 'Предстоящие', value: 'upcoming' },
  { label: 'Завершенные', value: 'completed' },
  { label: 'Отмененные', value: 'cancelled' }
]

// Моковые данные записей
const allAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    doctor: {
      id: '1',
      name: 'Др. Иванова Анна',
      speciality: 'Кардиолог',
      rating: 4.9,
      reviewsCount: 247,
      experience: 15,
      price: 2500,
      about: '',
      education: [],
      availableSlots: [],
      isOnline: true
    },
    date: '2024-01-16',
    time: '14:00',
    status: 'confirmed',
    type: 'online',
    notes: 'Консультация по поводу болей в области сердца'
  },
  {
    id: '2',
    doctorId: '2',
    doctor: {
      id: '2',
      name: 'Др. Петров Сергей',
      speciality: 'Терапевт',
      rating: 4.8,
      reviewsCount: 189,
      experience: 12,
      price: 2000,
      about: '',
      education: [],
      availableSlots: [],
      isOnline: false
    },
    date: '2024-01-18',
    time: '10:30',
    status: 'pending',
    type: 'offline'
  },
  {
    id: '3',
    doctorId: '3',
    doctor: {
      id: '3',
      name: 'Др. Сидорова Мария',
      speciality: 'Невролог',
      rating: 4.9,
      reviewsCount: 156,
      experience: 18,
      price: 3000,
      about: '',
      education: [],
      availableSlots: [],
      isOnline: true
    },
    date: '2024-01-12',
    time: '15:00',
    status: 'completed',
    type: 'online'
  },
  {
    id: '4',
    doctorId: '4',
    doctor: {
      id: '4',
      name: 'Др. Козлов Алексей',
      speciality: 'Дерматолог',
      rating: 4.7,
      reviewsCount: 203,
      experience: 10,
      price: 2200,
      about: '',
      education: [],
      availableSlots: [],
      isOnline: false
    },
    date: '2024-01-10',
    time: '11:00',
    status: 'cancelled',
    type: 'offline'
  }
]

const filteredAppointments = computed(() => {
  let result = [...allAppointments]
  
  if (activeStatusFilter.value === 'upcoming') {
    result = result.filter(app => ['pending', 'confirmed'].includes(app.status))
  } else if (activeStatusFilter.value !== 'all') {
    result = result.filter(app => app.status === activeStatusFilter.value)
  }
  
  // Сортировка по дате
  result.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`)
    const dateB = new Date(`${b.date} ${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })
  
  return result
})

const getCountByStatus = (status: string) => {
  if (status === 'all') return allAppointments.length
  if (status === 'upcoming') {
    return allAppointments.filter(app => ['pending', 'confirmed'].includes(app.status)).length
  }
  return allAppointments.filter(app => app.status === status).length
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  })
}

const getAppointmentStatusText = (status: string) => {
  const statusMap = {
    'pending': 'Ожидает подтверждения',
    'confirmed': 'Подтверждено',
    'completed': 'Завершено',
    'cancelled': 'Отменено'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getAppointmentStatusColor = (status: string) => {
  const colorMap = {
    'pending': 'yellow',
    'confirmed': 'green',
    'completed': 'blue',
    'cancelled': 'red'
  }
  return colorMap[status as keyof typeof colorMap] || 'gray'
}

const getAppointmentBorderColor = (status: string) => {
  const borderMap = {
    'pending': 'border-yellow-400',
    'confirmed': 'border-green-400',
    'completed': 'border-blue-400',
    'cancelled': 'border-red-400'
  }
  return borderMap[status as keyof typeof borderMap] || 'border-gray-400'
}

const getEmptyStateTitle = () => {
  const titleMap = {
    'all': 'У вас нет записей',
    'upcoming': 'Нет предстоящих записей',
    'completed': 'Нет завершенных записей',
    'cancelled': 'Нет отмененных записей'
  }
  return titleMap[activeStatusFilter.value as keyof typeof titleMap] || 'Записи не найдены'
}

const getEmptyStateDescription = () => {
  const descMap = {
    'all': 'Запишитесь к врачу для получения профессиональной медицинской помощи',
    'upcoming': 'Запланируйте визит к специалисту',
    'completed': 'Здесь будут отображаться завершенные приемы',
    'cancelled': 'У вас нет отмененных записей'
  }
  return descMap[activeStatusFilter.value as keyof typeof descMap] || ''
}

const canJoinCall = (appointment: Appointment) => {
  const appointmentTime = new Date(`${appointment.date} ${appointment.time}`)
  const now = new Date()
  const diffMinutes = (appointmentTime.getTime() - now.getTime()) / (1000 * 60)
  
  // Можно подключиться за 10 минут до приема
  return diffMinutes <= 10 && diffMinutes >= -30
}

const cancelAppointment = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  isCancelModalOpen.value = true
}

const confirmCancel = async () => {
  if (!selectedAppointment.value) return
  
  isCancelling.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Обновляем статус записи
    const index = allAppointments.findIndex(app => app.id === selectedAppointment.value?.id)
    if (index !== -1) {
      allAppointments[index].status = 'cancelled'
    }
    
    toast.add({
      title: 'Запись отменена',
      description: 'Уведомление отправлено врачу',
      color: 'green'
    })
    
    isCancelModalOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось отменить запись',
      color: 'red'
    })
  } finally {
    isCancelling.value = false
  }
}

const rescheduleAppointment = (appointment: Appointment) => {
  router.push(`/doctors/${appointment.doctorId}?reschedule=${appointment.id}`)
}

const joinVideoCall = (appointment: Appointment) => {
  router.push(`/video-call/${appointment.id}`)
}

const openChat = (appointment: Appointment) => {
  router.push(`/chat/${appointment.doctorId}`)
}

const writeReview = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  reviewRating.value = 0
  reviewComment.value = ''
  isReviewModalOpen.value = true
}

const submitReview = async () => {
  if (!selectedAppointment.value || reviewRating.value === 0) return
  
  isSubmittingReview.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      title: 'Отзыв отправлен',
      description: 'Спасибо за вашу оценку!',
      color: 'green'
    })
    
    isReviewModalOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось отправить отзыв',
      color: 'red'
    })
  } finally {
    isSubmittingReview.value = false
  }
}

const bookAgain = (appointment: Appointment) => {
  router.push(`/doctors/${appointment.doctorId}`)
}
</script>
