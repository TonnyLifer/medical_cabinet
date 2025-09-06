<template>
  <div>
    <!-- Хедер -->
    <div class="bg-white px-4 py-4 border-b border-gray-100">
      <h1 class="text-xl font-semibold text-gray-900">Чаты</h1>
    </div>

    <!-- Поиск -->
    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <UInput
        v-model="searchQuery"
        placeholder="Поиск в чатах..."
        size="lg"
        class="w-full"
      >
        <template #leading>
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
        </template>
      </UInput>
    </div>

    <!-- Список чатов -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
        @click="openChat(chat.doctorId)"
      >
        <div class="flex items-center space-x-4">
          <!-- Аватар -->
          <div class="relative">
            <div class="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:user" class="w-7 h-7 text-gray-500" />
            </div>
            <div 
              v-if="chat.isOnline"
              class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
            />
          </div>

          <!-- Информация о чате -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 truncate">{{ chat.doctorName }}</h3>
              <span class="text-xs text-gray-500">{{ formatTime(chat.lastMessageTime) }}</span>
            </div>
            
            <p class="text-sm text-gray-600 truncate mb-1">{{ chat.specialty }}</p>
            
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-500 truncate flex-1 mr-2">
                <Icon
                  v-if="chat.lastMessage.type === 'voice'"
                  name="heroicons:microphone"
                  class="w-4 h-4 inline mr-1"
                />
                <Icon
                  v-else-if="chat.lastMessage.type === 'image'"
                  name="heroicons:photo"
                  class="w-4 h-4 inline mr-1"
                />
                {{ getLastMessagePreview(chat.lastMessage) }}
              </p>
              
              <!-- Количество непрочитанных -->
              <UBadge
                v-if="chat.unreadCount > 0"
                :label="chat.unreadCount.toString()"
                color="red"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="filteredChats.length === 0" class="text-center py-12 px-4">
        <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Нет активных чатов</h3>
        <p class="text-gray-600 mb-6">
          Начните общение с врачом после записи на прием
        </p>
        <UButton
          color="blue"
          @click="$router.push('/doctors')"
        >
          Найти врача
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types'

definePageMeta({
  title: 'Чаты'
})

const router = useRouter()
const searchQuery = ref('')

interface ChatPreview {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  isOnline: boolean
  lastMessage: ChatMessage
  lastMessageTime: string
  unreadCount: number
}

// Моковые данные чатов
const allChats: ChatPreview[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Др. Иванова Анна',
    specialty: 'Кардиолог',
    isOnline: true,
    lastMessage: {
      id: '1',
      senderId: '1',
      senderName: 'Др. Иванова Анна',
      message: 'Результаты анализов выглядят хорошо. Продолжайте принимать назначенные препараты.',
      timestamp: '2024-01-15T14:30:00Z',
      type: 'text'
    },
    lastMessageTime: '2024-01-15T14:30:00Z',
    unreadCount: 2
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Др. Петров Сергей',
    specialty: 'Терапевт',
    isOnline: false,
    lastMessage: {
      id: '2',
      senderId: 'user',
      senderName: 'Вы',
      message: 'Спасибо за консультацию!',
      timestamp: '2024-01-14T16:45:00Z',
      type: 'text'
    },
    lastMessageTime: '2024-01-14T16:45:00Z',
    unreadCount: 0
  },
  {
    id: '3',
    doctorId: '3',
    doctorName: 'Др. Сидорова Мария',
    specialty: 'Невролог',
    isOnline: true,
    lastMessage: {
      id: '3',
      senderId: '3',
      senderName: 'Др. Сидорова Мария',
      message: 'Голосовое сообщение',
      timestamp: '2024-01-13T11:20:00Z',
      type: 'voice'
    },
    lastMessageTime: '2024-01-13T11:20:00Z',
    unreadCount: 1
  }
]

const filteredChats = computed(() => {
  if (!searchQuery.value) {
    return allChats.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    )
  }
  
  const query = searchQuery.value.toLowerCase()
  return allChats
    .filter(chat => 
      chat.doctorName.toLowerCase().includes(query) ||
      chat.specialty.toLowerCase().includes(query) ||
      chat.lastMessage.message.toLowerCase().includes(query)
    )
    .sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    )
})

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffHours < 24) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffHours < 48) {
    return 'Вчера'
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }
}

const getLastMessagePreview = (message: ChatMessage) => {
  if (message.type === 'voice') {
    return 'Голосовое сообщение'
  } else if (message.type === 'image') {
    return 'Изображение'
  } else if (message.type === 'video_call') {
    return 'Видеозвонок'
  }
  
  return message.message.length > 50 
    ? message.message.substring(0, 50) + '...'
    : message.message
}

const openChat = (doctorId: string) => {
  router.push(`/chat/${doctorId}`)
}
</script>
