<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Хедер чата -->
    <div class="bg-white px-4 py-4 border-b border-gray-100 flex items-center space-x-4">
      <UButton
        icon="heroicons:arrow-left"
        variant="ghost"
        @click="$router.back()"
      />
      
      <div class="flex items-center space-x-3 flex-1">
        <div class="relative">
          <div class="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:user" class="w-5 h-5 text-gray-500" />
          </div>
          <div 
            v-if="doctorInfo.isOnline"
            class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
          />
        </div>
        
        <div class="flex-1">
          <h2 class="font-semibold text-gray-900">{{ doctorInfo.name }}</h2>
          <p class="text-sm text-gray-600">
            {{ doctorInfo.isOnline ? 'В сети' : 'Был в сети недавно' }}
          </p>
        </div>
      </div>

      <UButton
        icon="heroicons:video-camera"
        variant="ghost"
        color="blue"
        @click="startVideoCall"
        :disabled="!doctorInfo.isOnline"
      />
    </div>

    <!-- Сообщения -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.senderId === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl"
          :class="message.senderId === 'user' 
            ? 'bg-medical-500 text-white rounded-br-md' 
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'"
        >
          <!-- Текстовое сообщение -->
          <div v-if="message.type === 'text'">
            <p class="text-sm">{{ message.message }}</p>
          </div>

          <!-- Голосовое сообщение -->
          <div v-else-if="message.type === 'voice'" class="flex items-center space-x-3">
            <UButton
              :icon="isPlayingVoice === message.id ? 'heroicons:pause' : 'heroicons:play'"
              variant="ghost"
              size="sm"
              :color="message.senderId === 'user' ? 'white' : 'blue'"
              @click="toggleVoiceMessage(message.id)"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div
                    v-for="bar in 20"
                    :key="bar"
                    class="w-1 rounded-full"
                    :class="message.senderId === 'user' ? 'bg-white/50' : 'bg-gray-300'"
                    :style="{ height: `${Math.random() * 20 + 5}px` }"
                  />
                </div>
                <span class="text-xs opacity-75">0:45</span>
              </div>
            </div>
          </div>

          <!-- Изображение -->
          <div v-else-if="message.type === 'image'" class="space-y-2">
            <div class="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:photo" class="w-8 h-8 text-gray-400" />
            </div>
            <p v-if="message.message" class="text-sm">{{ message.message }}</p>
          </div>

          <!-- Видеозвонок -->
          <div v-else-if="message.type === 'video_call'" class="flex items-center space-x-3">
            <Icon 
              name="heroicons:video-camera" 
              class="w-5 h-5"
              :class="message.senderId === 'user' ? 'text-white' : 'text-blue-500'"
            />
            <div>
              <p class="text-sm font-medium">{{ message.message }}</p>
              <p class="text-xs opacity-75">Длительность: 15 мин</p>
            </div>
          </div>

          <!-- Время сообщения -->
          <p 
            class="text-xs mt-2 opacity-75"
            :class="message.senderId === 'user' ? 'text-right' : 'text-left'"
          >
            {{ formatMessageTime(message.timestamp) }}
          </p>
        </div>
      </div>

      <!-- Индикатор печати -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
          <div class="flex items-center space-x-1">
            <div 
              v-for="dot in 3"
              :key="dot"
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              :style="{ animationDelay: `${dot * 0.1}s` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Поле ввода -->
    <div class="bg-white border-t border-gray-200 px-4 py-4">
      <div class="flex items-end space-x-3">
        <!-- Кнопка прикрепления -->
        <UButton
          icon="heroicons:plus"
          variant="ghost"
          @click="toggleAttachmentMenu"
        />

        <!-- Поле ввода текста -->
        <div class="flex-1">
          <UInput
            v-model="newMessage"
            placeholder="Введите сообщение..."
            size="lg"
            class="w-full"
            @keydown.enter="sendMessage"
            @input="handleTyping"
          />
        </div>

        <!-- Кнопка отправки/записи голоса -->
        <UButton
          v-if="newMessage.trim()"
          icon="heroicons:paper-airplane"
          color="blue"
          @click="sendMessage"
        />
        <UButton
          v-else
          :icon="isRecording ? 'heroicons:stop' : 'heroicons:microphone'"
          :color="isRecording ? 'red' : 'gray'"
          @click="toggleVoiceRecording"
        />
      </div>

      <!-- Меню вложений -->
      <div v-if="showAttachmentMenu" class="mt-3 flex space-x-4">
        <UButton
          icon="heroicons:camera"
          variant="outline"
          size="sm"
          @click="attachPhoto"
        >
          Фото
        </UButton>
        <UButton
          icon="heroicons:document"
          variant="outline"
          size="sm"
          @click="attachDocument"
        >
          Документ
        </UButton>
        <UButton
          icon="heroicons:map-pin"
          variant="outline"
          size="sm"
          @click="attachLocation"
        >
          Локация
        </UButton>
      </div>
    </div>

    <!-- Модальное окно видеозвонка -->
    <UModal v-model="isVideoCallModalOpen">
      <div class="p-6 text-center">
        <div class="w-20 h-20 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Icon name="heroicons:user" class="w-10 h-10 text-gray-500" />
        </div>
        <h3 class="text-lg font-semibold mb-2">{{ doctorInfo.name }}</h3>
        <p class="text-gray-600 mb-6">Исходящий видеозвонок...</p>
        
        <div class="flex justify-center space-x-4">
          <UButton
            icon="heroicons:phone-x-mark"
            color="red"
            size="lg"
            @click="endCall"
          >
            Завершить
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types'

definePageMeta({
  title: 'Чат с врачом'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const doctorId = route.params.doctorId as string
const newMessage = ref('')
const isTyping = ref(false)
const isRecording = ref(false)
const isPlayingVoice = ref<string | null>(null)
const showAttachmentMenu = ref(false)
const isVideoCallModalOpen = ref(false)
const messagesContainer = ref<HTMLElement>()

let typingTimer: NodeJS.Timeout

// Информация о враче
const doctorInfo = ref({
  id: doctorId,
  name: 'Др. Иванова Анна',
  specialty: 'Кардиолог',
  isOnline: true
})

// Сообщения
const messages = ref<ChatMessage[]>([
  {
    id: '1',
    senderId: doctorId,
    senderName: 'Др. Иванова Анна',
    message: 'Здравствуйте! Как дела после последней консультации?',
    timestamp: '2024-01-15T10:00:00Z',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'user',
    senderName: 'Вы',
    message: 'Здравствуйте! Чувствую себя лучше, спасибо.',
    timestamp: '2024-01-15T10:05:00Z',
    type: 'text'
  },
  {
    id: '3',
    senderId: doctorId,
    senderName: 'Др. Иванова Анна',
    message: 'Отлично! А как с препаратами, которые я назначила?',
    timestamp: '2024-01-15T10:07:00Z',
    type: 'text'
  },
  {
    id: '4',
    senderId: 'user',
    senderName: 'Вы',
    message: 'Голосовое сообщение',
    timestamp: '2024-01-15T10:10:00Z',
    type: 'voice'
  },
  {
    id: '5',
    senderId: doctorId,
    senderName: 'Др. Иванова Анна',
    message: 'Хорошо, продолжайте принимать. Если появятся вопросы - обращайтесь!',
    timestamp: '2024-01-15T10:15:00Z',
    type: 'text'
  }
])

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message: ChatMessage = {
    id: Date.now().toString(),
    senderId: 'user',
    senderName: 'Вы',
    message: newMessage.value.trim(),
    timestamp: new Date().toISOString(),
    type: 'text'
  }

  messages.value.push(message)
  newMessage.value = ''
  
  // Прокрутка к последнему сообщению
  nextTick(() => {
    scrollToBottom()
  })

  // Симуляция ответа врача
  setTimeout(() => {
    simulateDoctorTyping()
  }, 1000)
}

const handleTyping = () => {
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    // Логика для отправки статуса "печатает"
  }, 500)
}

const toggleVoiceRecording = () => {
  if (!isRecording.value) {
    // Начинаем запись
    isRecording.value = true
    toast.add({
      title: 'Запись голоса',
      description: 'Говорите...',
      color: 'blue'
    })
  } else {
    // Останавливаем запись
    isRecording.value = false
    
    // Симуляция отправки голосового сообщения
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'Вы',
      message: 'Голосовое сообщение',
      timestamp: new Date().toISOString(),
      type: 'voice'
    }
    
    messages.value.push(voiceMessage)
    
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const toggleVoiceMessage = (messageId: string) => {
  if (isPlayingVoice.value === messageId) {
    isPlayingVoice.value = null
  } else {
    isPlayingVoice.value = messageId
    // Симуляция проигрывания
    setTimeout(() => {
      isPlayingVoice.value = null
    }, 3000)
  }
}

const toggleAttachmentMenu = () => {
  showAttachmentMenu.value = !showAttachmentMenu.value
}

const attachPhoto = () => {
  // Симуляция прикрепления фото
  const imageMessage: ChatMessage = {
    id: Date.now().toString(),
    senderId: 'user',
    senderName: 'Вы',
    message: 'Фото симптомов',
    timestamp: new Date().toISOString(),
    type: 'image'
  }
  
  messages.value.push(imageMessage)
  showAttachmentMenu.value = false
  
  nextTick(() => {
    scrollToBottom()
  })
}

const attachDocument = () => {
  toast.add({
    title: 'В разработке',
    description: 'Функция прикрепления документов скоро будет доступна',
    color: 'yellow'
  })
  showAttachmentMenu.value = false
}

const attachLocation = () => {
  toast.add({
    title: 'В разработке',
    description: 'Функция отправки геолокации скоро будет доступна',
    color: 'yellow'
  })
  showAttachmentMenu.value = false
}

const startVideoCall = () => {
  if (!doctorInfo.value.isOnline) {
    toast.add({
      title: 'Врач не в сети',
      description: 'Видеозвонок недоступен',
      color: 'yellow'
    })
    return
  }
  
  isVideoCallModalOpen.value = true
  
  // Симуляция установки соединения
  setTimeout(() => {
    isVideoCallModalOpen.value = false
    router.push(`/video-call/${doctorId}`)
  }, 3000)
}

const endCall = () => {
  isVideoCallModalOpen.value = false
}

const simulateDoctorTyping = () => {
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    const responses = [
      'Понятно. Продолжайте наблюдение.',
      'Если появятся новые симптомы, сразу обращайтесь.',
      'Хорошо. Следующий контроль через неделю.',
      'Рекомендую также сдать дополнительные анализы.'
    ]
    
    const response: ChatMessage = {
      id: Date.now().toString(),
      senderId: doctorId,
      senderName: doctorInfo.value.name,
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    
    messages.value.push(response)
    
    nextTick(() => {
      scrollToBottom()
    })
  }, 2000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessageTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Автоскролл при загрузке
onMounted(() => {
  scrollToBottom()
})

// Устанавливаем заголовок страницы
useHead({
  title: computed(() => `Чат с ${doctorInfo.value.name}`)
})
</script>
