<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <AppNavigation 
      @open-search="openSearch"
      @open-notifications="openNotifications"
    />
    
    <!-- Хедер (только для мобильной версии) -->
    <header class="bg-white shadow-sm sticky top-0 z-40 md:hidden">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Логотип -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center">
              <!-- <Icon name="heroicons:heart" class="w-6 h-6 text-white" /> -->
              <img src="@/assets/images/logo.png" alt="logo"/>
            </div>
            <span class="text-xl font-bold text-gray-900">Комир</span>
          </div>

          <!-- Иконки справа -->
          <div class="flex items-center space-x-2">
            <!-- Кнопка поиска -->
            <button
              class="header-button"
              @click="openSearch"
            >
              <Icon 
                name="heroicons:magnifying-glass" 
                class="header-icon" 
              />
            </button>
            
            <!-- Кнопка уведомлений -->
            <button
              class="header-button"
              @click="openNotifications"
            >
              <Icon 
                name="heroicons:bell" 
                class="header-icon" 
              />
              <!-- Бейдж уведомлений -->
              <div
                v-if="unreadNotifications > 0"
                class="notification-badge"
                style="position: absolute; top: -4px; right: -4px; width: 24px; height: 24px; background-color: #ef4444; color: white; font-size: 12px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); z-index: 10;"
              >
                {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="pb-20 md:pb-0 md:ml-64 transition-none">
      <slot />
    </main>

    <!-- Модальные окна -->
    <SearchModal 
      v-model="isSearchOpen" 
      @select="selectSearchResult"
    />

    <UModal v-model="isNotificationsOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Уведомления</h3>
        <div class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="p-4 bg-gray-50 rounded-lg"
            :class="{ 'bg-blue-50': !notification.isRead }"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="font-medium">{{ notification.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ formatDate(notification.timestamp) }}</p>
              </div>
              <UBadge
                v-if="!notification.isRead"
                label="Новое"
                color="blue"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/types'
import AppNavigation from '~/components/AppNavigation.vue'
import SearchModal from '~/components/SearchModal.vue'

const route = useRoute()
const router = useRouter()

const isSearchOpen = ref(false)
const isNotificationsOpen = ref(false)
const unreadNotifications = ref(3)

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Напоминание о приеме',
    message: 'Завтра в 14:00 у вас прием у кардиолога',
    type: 'appointment',
    timestamp: '2024-01-15T10:00:00Z',
    isRead: false
  },
  {
    id: '2',
    title: 'Результаты анализов',
    message: 'Готовы результаты ваших анализов',
    type: 'system',
    timestamp: '2024-01-14T15:30:00Z',
    isRead: false
  },
  {
    id: '3',
    title: 'Новое сообщение',
    message: 'Доктор Иванов ответил на ваш вопрос',
    type: 'system',
    timestamp: '2024-01-14T12:00:00Z',
    isRead: true
  }
]

const openSearch = () => {
  isSearchOpen.value = true
}

// Слушаем событие открытия поиска с главной страницы
onMounted(() => {
  window.addEventListener('open-search', openSearch)
})

onUnmounted(() => {
  window.removeEventListener('open-search', openSearch)
})

const openNotifications = () => {
  isNotificationsOpen.value = true
  // Отмечаем уведомления как прочитанные
  unreadNotifications.value = 0
}

const selectSearchResult = (result: any) => {
  isSearchOpen.value = false
  // Переход к результату поиска
  router.push(`/doctors?specialty=${result.title}`)
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
