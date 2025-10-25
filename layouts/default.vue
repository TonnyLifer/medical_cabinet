<template>
    
    <!-- Основной контент -->
    <main class="pb-20 md:pb-0">
      <slot />
    </main>

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
