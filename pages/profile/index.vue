<template>
  <div>
    <!-- Профиль пользователя -->
    <div class="bg-gradient-to-br from-medical-500 to-medical-600 px-4 py-8 text-white">
      <div class="flex items-center space-x-4">
        <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
          <Icon name="heroicons:user" class="w-10 h-10 text-white" />
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold">{{ user.name }}</h1>
          <p class="text-medical-100 text-lg">{{ user.email }}</p>
          <p class="text-medical-200 text-sm">{{ user.phone }}</p>
        </div>
        <UButton
          icon="heroicons:pencil"
          variant="ghost"
          color="white"
          @click="editProfile"
        />
      </div>
    </div>

    <!-- Статистика -->
    <div class="bg-white mx-4 -mt-4 rounded-2xl shadow-sm p-6 relative z-10 mb-6">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-medical-600">{{ stats.appointments }}</p>
          <p class="text-sm text-gray-600">Приемов</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-medical-600">{{ stats.doctors }}</p>
          <p class="text-sm text-gray-600">Врачей</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-medical-600">{{ stats.prescriptions }}</p>
          <p class="text-sm text-gray-600">Рецептов</p>
        </div>
      </div>
    </div>

    <!-- Основные разделы -->
    <div class="px-4 space-y-4">
      <!-- Здоровье -->
      <div class="bg-white rounded-2xl shadow-sm">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="heroicons:heart" class="w-5 h-5 text-red-500 mr-2" />
            Здоровье
          </h2>
        </div>
        <div class="p-4 space-y-3">
          <div 
            v-for="item in healthItems"
            :key="item.name"
            class="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
            @click="item.action"
          >
            <div class="flex items-center space-x-3">
              <Icon :name="item.icon" class="w-5 h-5 text-gray-400" />
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="item.value" class="text-sm text-gray-600">{{ item.value }}</span>
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Мои данные -->
      <div class="bg-white rounded-2xl shadow-sm">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="heroicons:user-circle" class="w-5 h-5 text-blue-500 mr-2" />
            Мои данные
          </h2>
        </div>
        <div class="p-4 space-y-3">
          <div 
            v-for="item in profileItems"
            :key="item.name"
            class="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
            @click="item.action"
          >
            <div class="flex items-center space-x-3">
              <Icon :name="item.icon" class="w-5 h-5 text-gray-400" />
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="item.value" class="text-sm text-gray-600">{{ item.value }}</span>
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Приложение -->
      <div class="bg-white rounded-2xl shadow-sm">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-500 mr-2" />
            Приложение
          </h2>
        </div>
        <div class="p-4 space-y-3">
          <div 
            v-for="item in appItems"
            :key="item.name"
            class="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
            @click="item.action"
          >
            <div class="flex items-center space-x-3">
              <Icon :name="item.icon" class="w-5 h-5 text-gray-400" />
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge
                v-if="item.badge"
                :label="item.badge"
                color="red"
                size="sm"
              />
              <UToggle
                v-if="item.toggle !== undefined"
                v-model="item.toggle"
                @change="item.action"
              />
              <Icon 
                v-else
                name="heroicons:chevron-right" 
                class="w-4 h-4 text-gray-400" 
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Помощь -->
      <div class="bg-white rounded-2xl shadow-sm">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-green-500 mr-2" />
            Помощь
          </h2>
        </div>
        <div class="p-4 space-y-3">
          <div 
            v-for="item in helpItems"
            :key="item.name"
            class="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
            @click="item.action"
          >
            <div class="flex items-center space-x-3">
              <Icon :name="item.icon" class="w-5 h-5 text-gray-400" />
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </div>
            <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Выход -->
      <div class="pb-8">
        <UButton
          color="red"
          variant="outline"
          size="lg"
          class="w-full"
          @click="logout"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
          Выйти из аккаунта
        </UButton>
      </div>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <UModal v-model="isEditProfileOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-6">Редактировать профиль</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Полное имя
            </label>
            <UInput
              v-model="editedUser.name"
              placeholder="Введите имя"
              size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <UInput
              v-model="editedUser.email"
              type="email"
              placeholder="Введите email"
              size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <UInput
              v-model="editedUser.phone"
              type="tel"
              placeholder="Введите телефон"
              size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Дата рождения
            </label>
            <UInput
              v-model="editedUser.dateOfBirth"
              type="date"
              size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Пол
            </label>
            <div class="grid grid-cols-3 gap-3">
              <URadio
                v-model="editedUser.gender"
                value="male"
                label="Мужской"
              />
              <URadio
                v-model="editedUser.gender"
                value="female"
                label="Женский"
              />
              <URadio
                v-model="editedUser.gender"
                value="other"
                label="Другой"
              />
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isEditProfileOpen = false"
          >
            Отмена
          </UButton>
          <UButton
            color="blue"
            class="flex-1"
            :loading="isSaving"
            @click="saveProfile"
          >
            Сохранить
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Модальное окно выхода -->
    <UModal v-model="isLogoutModalOpen">
      <div class="p-6 text-center">
        <Icon name="heroicons:arrow-right-on-rectangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold mb-2">Выйти из аккаунта?</h3>
        <p class="text-gray-600 mb-6">
          Вы уверены, что хотите выйти из своего аккаунта?
        </p>
        
        <div class="flex space-x-3">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isLogoutModalOpen = false"
          >
            Отмена
          </UButton>
          <UButton
            color="red"
            class="flex-1"
            @click="confirmLogout"
          >
            Выйти
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({
  title: 'Профиль'
})

const router = useRouter()
const toast = useToast()

const isEditProfileOpen = ref(false)
const isLogoutModalOpen = ref(false)
const isSaving = ref(false)

// Данные пользователя
const user = ref<User>({
  id: '1',
  name: 'Анна Иванова',
  email: 'anna.ivanova@example.com',
  phone: '+7 (999) 123-45-67',
  dateOfBirth: '1990-05-15',
  gender: 'female'
})

const editedUser = ref<User>({ ...user.value })

// Статистика
const stats = ref({
  appointments: 12,
  doctors: 5,
  prescriptions: 8
})

// Настройки уведомлений
const notificationsEnabled = ref(true)
const locationEnabled = ref(true)

const healthItems = [
  {
    name: 'Медицинская карта',
    icon: 'heroicons:document-text',
    value: '8 записей',
    action: () => router.push('/medical-records')
  },
  {
    name: 'Анализы',
    icon: 'heroicons:beaker',
    value: '3 результата',
    action: () => router.push('/lab-results')
  },
  {
    name: 'Рецепты',
    icon: 'heroicons:clipboard-document-list',
    value: '5 активных',
    action: () => router.push('/prescriptions')
  },
  {
    name: 'Избранные врачи',
    icon: 'heroicons:heart',
    value: '7 врачей',
    action: () => router.push('/favorites')
  }
]

const profileItems = [
  {
    name: 'Личная информация',
    icon: 'heroicons:identification',
    action: () => editProfile()
  },
  {
    name: 'Платежные методы',
    icon: 'heroicons:credit-card',
    action: () => router.push('/payment-methods')
  },
  {
    name: 'Адреса',
    icon: 'heroicons:map-pin',
    value: '2 адреса',
    action: () => router.push('/addresses')
  },
  {
    name: 'Страховка',
    icon: 'heroicons:shield-check',
    action: () => router.push('/insurance')
  }
]

const appItems = [
  {
    name: 'Уведомления',
    icon: 'heroicons:bell',
    toggle: notificationsEnabled,
    action: () => toggleNotifications()
  },
  {
    name: 'Геолокация',
    icon: 'heroicons:map-pin',
    toggle: locationEnabled,
    action: () => toggleLocation()
  },
  {
    name: 'Язык',
    icon: 'heroicons:language',
    value: 'Русский',
    action: () => router.push('/language')
  },
  {
    name: 'Тема',
    icon: 'heroicons:moon',
    value: 'Светлая',
    action: () => router.push('/theme')
  },
  {
    name: 'Обновления',
    icon: 'heroicons:arrow-down-tray',
    badge: '1',
    action: () => checkUpdates()
  }
]

const helpItems = [
  {
    name: 'Часто задаваемые вопросы',
    icon: 'heroicons:question-mark-circle',
    action: () => router.push('/faq')
  },
  {
    name: 'Связаться с поддержкой',
    icon: 'heroicons:chat-bubble-left-ellipsis',
    action: () => router.push('/support')
  },
  {
    name: 'Политика конфиденциальности',
    icon: 'heroicons:shield-check',
    action: () => router.push('/privacy')
  },
  {
    name: 'Условия использования',
    icon: 'heroicons:document',
    action: () => router.push('/terms')
  },
  {
    name: 'О приложении',
    icon: 'heroicons:information-circle',
    action: () => router.push('/about')
  }
]

const editProfile = () => {
  editedUser.value = { ...user.value }
  isEditProfileOpen.value = true
}

const saveProfile = async () => {
  isSaving.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    user.value = { ...editedUser.value }
    
    toast.add({
      title: 'Профиль обновлен',
      description: 'Ваши данные успешно сохранены',
      color: 'green'
    })
    
    isEditProfileOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось сохранить изменения',
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}

const toggleNotifications = () => {
  toast.add({
    title: notificationsEnabled.value ? 'Уведомления включены' : 'Уведомления отключены',
    color: 'blue'
  })
}

const toggleLocation = () => {
  toast.add({
    title: locationEnabled.value ? 'Геолокация включена' : 'Геолокация отключена',
    color: 'blue'
  })
}

const checkUpdates = () => {
  toast.add({
    title: 'Обновлений нет',
    description: 'У вас установлена последняя версия',
    color: 'green'
  })
}

const logout = () => {
  isLogoutModalOpen.value = true
}

const confirmLogout = () => {
  // Очистка данных пользователя
  if (process.client) {
    localStorage.clear()
  }
  
  toast.add({
    title: 'Выход выполнен',
    description: 'До свидания!',
    color: 'green'
  })
  
  router.push('/auth/login')
}
</script>
