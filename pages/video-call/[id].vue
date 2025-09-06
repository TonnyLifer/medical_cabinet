<template>
  <div class="fixed inset-0 bg-black">
    <!-- Главное видео (врач) -->
    <div class="relative w-full h-full">
      <div class="w-full h-full bg-gray-900 flex items-center justify-center">
        <div class="text-center text-white">
          <div class="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="heroicons:user" class="w-16 h-16 text-gray-400" />
          </div>
          <h2 class="text-2xl font-semibold mb-2">{{ doctorName }}</h2>
          <p class="text-gray-300">{{ connectionStatus }}</p>
        </div>
      </div>

      <!-- Превью собственного видео -->
      <div class="absolute top-4 right-4 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20">
        <div class="w-full h-full bg-gray-700 flex items-center justify-center">
          <Icon name="heroicons:user" class="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <!-- Информация о звонке -->
      <div class="absolute top-4 left-4 bg-black/50 rounded-xl px-4 py-2">
        <div class="flex items-center space-x-2 text-white">
          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium">{{ callDuration }}</span>
        </div>
      </div>

      <!-- Статус качества соединения -->
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-xl px-3 py-1">
        <div class="flex items-center space-x-2 text-white">
          <Icon 
            :name="getConnectionIcon()"
            class="w-4 h-4"
            :class="getConnectionColor()"
          />
          <span class="text-xs">{{ getConnectionText() }}</span>
        </div>
      </div>
    </div>

    <!-- Панель управления -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
      <div class="flex justify-center space-x-6">
        <!-- Микрофон -->
        <UButton
          :icon="isMicMuted ? 'heroicons:microphone-slash' : 'heroicons:microphone'"
          :color="isMicMuted ? 'red' : 'gray'"
          size="xl"
          variant="solid"
          class="rounded-full w-14 h-14"
          @click="toggleMicrophone"
        />

        <!-- Камера -->
        <UButton
          :icon="isCameraOff ? 'heroicons:video-camera-slash' : 'heroicons:video-camera'"
          :color="isCameraOff ? 'red' : 'gray'"
          size="xl"
          variant="solid"
          class="rounded-full w-14 h-14"
          @click="toggleCamera"
        />

        <!-- Завершить звонок -->
        <UButton
          icon="heroicons:phone-x-mark"
          color="red"
          size="xl"
          variant="solid"
          class="rounded-full w-14 h-14"
          @click="endCall"
        />

        <!-- Дополнительные функции -->
        <UButton
          icon="heroicons:ellipsis-horizontal"
          color="gray"
          size="xl"
          variant="solid"
          class="rounded-full w-14 h-14"
          @click="showMoreOptions = !showMoreOptions"
        />
      </div>

      <!-- Дополнительные опции -->
      <div v-if="showMoreOptions" class="mt-4 flex justify-center space-x-4">
        <UButton
          icon="heroicons:speaker-wave"
          variant="outline"
          color="white"
          @click="toggleSpeaker"
        >
          {{ isSpeakerOn ? 'Динамик выкл' : 'Динамик вкл' }}
        </UButton>
        
        <UButton
          icon="heroicons:chat-bubble-left"
          variant="outline"
          color="white"
          @click="openChat"
        >
          Чат
        </UButton>
        
        <UButton
          icon="heroicons:share"
          variant="outline"
          color="white"
          @click="shareScreen"
        >
          Экран
        </UButton>
      </div>
    </div>

    <!-- Модальное окно завершения звонка -->
    <UModal v-model="isEndCallModalOpen">
      <div class="p-6 text-center">
        <Icon name="heroicons:phone-x-mark" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold mb-2">Завершить звонок?</h3>
        <p class="text-gray-600 mb-6">
          Вы уверены, что хотите завершить видеозвонок с {{ doctorName }}?
        </p>
        
        <div class="flex space-x-3">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isEndCallModalOpen = false"
          >
            Отмена
          </UButton>
          <UButton
            color="red"
            class="flex-1"
            @click="confirmEndCall"
          >
            Завершить
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Уведомления во время звонка -->
    <div class="absolute top-20 left-4 right-4 space-y-2">
      <div
        v-for="notification in callNotifications"
        :key="notification.id"
        class="bg-black/70 text-white px-4 py-2 rounded-lg text-sm"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Видеозвонок',
  layout: false
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const appointmentId = route.params.id as string

// Состояние звонка
const doctorName = ref('Др. Иванова Анна')
const connectionStatus = ref('Подключение...')
const callDuration = ref('00:00')
const connectionQuality = ref('good') // poor, fair, good, excellent
const isMicMuted = ref(false)
const isCameraOff = ref(false)
const isSpeakerOn = ref(false)
const showMoreOptions = ref(false)
const isEndCallModalOpen = ref(false)

// Уведомления
const callNotifications = ref<Array<{ id: string, message: string }>>([])

// Симуляция установки соединения
onMounted(() => {
  setTimeout(() => {
    connectionStatus.value = 'Соединение установлено'
    startCallTimer()
    
    addNotification('Врач присоединился к звонку')
  }, 2000)
  
  setTimeout(() => {
    connectionStatus.value = ''
  }, 4000)
})

let callTimer: NodeJS.Timeout
let callStartTime: number

const startCallTimer = () => {
  callStartTime = Date.now()
  
  callTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - callStartTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    callDuration.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

const addNotification = (message: string) => {
  const notification = {
    id: Date.now().toString(),
    message
  }
  
  callNotifications.value.push(notification)
  
  // Автоматически убираем уведомление через 3 секунды
  setTimeout(() => {
    const index = callNotifications.value.findIndex(n => n.id === notification.id)
    if (index > -1) {
      callNotifications.value.splice(index, 1)
    }
  }, 3000)
}

const toggleMicrophone = () => {
  isMicMuted.value = !isMicMuted.value
  addNotification(isMicMuted.value ? 'Микрофон отключен' : 'Микрофон включен')
}

const toggleCamera = () => {
  isCameraOff.value = !isCameraOff.value
  addNotification(isCameraOff.value ? 'Камера отключена' : 'Камера включена')
}

const toggleSpeaker = () => {
  isSpeakerOn.value = !isSpeakerOn.value
  addNotification(isSpeakerOn.value ? 'Динамик включен' : 'Динамик отключен')
}

const shareScreen = () => {
  toast.add({
    title: 'В разработке',
    description: 'Функция демонстрации экрана скоро будет доступна',
    color: 'yellow'
  })
}

const openChat = () => {
  // Открываем чат в новом окне или модальном окне
  toast.add({
    title: 'Чат',
    description: 'Функция чата во время звонка в разработке',
    color: 'blue'
  })
}

const endCall = () => {
  isEndCallModalOpen.value = true
}

const confirmEndCall = () => {
  clearInterval(callTimer)
  
  // Симуляция завершения звонка
  toast.add({
    title: 'Звонок завершен',
    description: `Длительность: ${callDuration.value}`,
    color: 'green'
  })
  
  router.push('/appointments')
}

const getConnectionIcon = () => {
  switch (connectionQuality.value) {
    case 'poor': return 'heroicons:signal-slash'
    case 'fair': return 'heroicons:signal'
    case 'good': return 'heroicons:signal'
    case 'excellent': return 'heroicons:signal'
    default: return 'heroicons:signal'
  }
}

const getConnectionColor = () => {
  switch (connectionQuality.value) {
    case 'poor': return 'text-red-400'
    case 'fair': return 'text-yellow-400'
    case 'good': return 'text-green-400'
    case 'excellent': return 'text-green-400'
    default: return 'text-gray-400'
  }
}

const getConnectionText = () => {
  switch (connectionQuality.value) {
    case 'poor': return 'Плохое соединение'
    case 'fair': return 'Среднее соединение'
    case 'good': return 'Хорошее соединение'
    case 'excellent': return 'Отличное соединение'
    default: return 'Проверка соединения...'
  }
}

// Симуляция изменения качества соединения
onMounted(() => {
  const qualities = ['poor', 'fair', 'good', 'excellent']
  let currentIndex = 0
  
  const qualityInterval = setInterval(() => {
    connectionQuality.value = qualities[currentIndex]
    currentIndex = (currentIndex + 1) % qualities.length
  }, 10000)
  
  onUnmounted(() => {
    clearInterval(qualityInterval)
  })
})

onUnmounted(() => {
  if (callTimer) {
    clearInterval(callTimer)
  }
})
</script>
