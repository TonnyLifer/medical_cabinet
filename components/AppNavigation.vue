<template>
  <!-- Мобильная навигация (внизу) -->
  <nav 
    class="bottom-nav md:hidden"
  >
    <div class="flex items-center justify-around py-2 px-4">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center py-2 px-3 min-w-[60px]"
      >
        <!-- Специальная синяя кнопка для записей (всегда круглая) -->
        <div v-if="item.name === 'Записи'" class="nav-appointment-bg">
          <Icon name="heroicons:plus" class="w-6 h-6" />
        </div>
        <!-- Активные элементы (квадратное выделение) -->
        <div v-else-if="isActiveRoute(item.path)" class="nav-active-bg">
          <Icon :name="item.icon" class="w-5 h-5" />
        </div>
        <!-- Неактивные иконки -->
        <Icon v-else :name="item.icon" class="w-6 h-6" />
      </NuxtLink>
    </div>
  </nav>

  <!-- Десктопная навигация (слева) -->
  <aside 
    class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200 z-40"
  >
    <div class="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <!-- Логотип -->
      <div class="flex items-center flex-shrink-0 px-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <img src="@/assets/images/logo.png" alt="logo"/>
          </div>
          <span class="text-xl font-bold text-gray-900">Комир</span>
        </div>
      </div>
      
      <!-- Поиск и уведомления для десктопа -->
      <div class="px-4 mb-6 space-y-3">
        <button
          class="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-gray-300"
          @click="$emit('openSearch')"
        >
          <div class="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </div>
          <span class="text-sm font-medium">Поиск</span>
        </button>
        
        <button 
          class="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-gray-300 relative"
          @click="$emit('openNotifications')"
        >
          <div class="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <Icon name="heroicons:bell" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </div>
          <span class="text-sm font-medium">Уведомления</span>
          <!-- Бейдж уведомлений -->
          <div 
            class="absolute right-4 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
            style="position: absolute; right: 16px; width: 20px; height: 20px; background-color: #ef4444; color: white; font-size: 12px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); z-index: 10;"
          >
            3
          </div>
        </button>
      </div>
      
      <!-- Навигационные элементы -->
      <nav class="mt-8 flex-1 px-2 space-y-1">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
          :class="isActiveRoute(item.path) 
            ? 'bg-blue-100 text-blue-900' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <Icon 
            :name="item.icon" 
            class="mr-3 flex-shrink-0 h-6 w-6"
            :class="isActiveRoute(item.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
          />
          {{ item.name }}
          
          <!-- Плюс для записей -->
          <div v-if="item.name === 'Записи'" class="ml-auto">
            <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="heroicons:plus" class="w-4 h-4 text-white" />
            </div>
          </div>
        </NuxtLink>
      </nav>
      
      <!-- Дополнительные элементы в футере -->
      <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user" class="w-5 h-5 text-gray-500" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700">mosarraf</p>
            <p class="text-xs text-gray-500">Chandpur, BD</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

// Определяем события, которые компонент может emit'ить
defineEmits(['openSearch', 'openNotifications'])

const navigationItems = [
  {
    name: 'Главная',
    path: '/',
    icon: 'heroicons:home'
  },
  {
    name: 'Избранное',
    path: '/favorites',
    icon: 'heroicons:heart'
  },
  {
    name: 'Записи',
    path: '/appointments',
    icon: 'heroicons:plus-circle'
  },
  {
    name: 'Корзина',
    path: '/cart',
    icon: 'heroicons:shopping-bag'
  },
  {
    name: 'Профиль',
    path: '/profile',
    icon: 'heroicons:user-circle'
  }
]

const isActiveRoute = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

