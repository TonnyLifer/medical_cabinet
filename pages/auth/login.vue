<template>
  <div>
    <NuxtLayout name="auth">
      <div class="bg-white rounded-3xl shadow-medical p-8 space-y-8">
        <!-- Логотип и заголовок -->
        <div class="text-center space-y-4">
          <div class="w-20 h-20 bg-medical-500 rounded-2xl mx-auto flex items-center justify-center">
            <Icon name="heroicons:heart" class="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Добро пожаловать</h1>
            <p class="text-gray-600 mt-2">Войдите в свой аккаунт</p>
          </div>
        </div>

        <!-- Форма входа -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email или телефон
              </label>
              <UInput
                v-model="loginForm.email"
                type="email"
                placeholder="your@email.com"
                size="lg"
                :trailing="false"
                class="w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <UInput
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Введите пароль"
                size="lg"
                class="w-full"
                required
              >
                <template #trailing>
                  <UButton
                    :icon="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                    variant="ghost"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <UCheckbox v-model="loginForm.rememberMe" label="Запомнить меня" />
            <NuxtLink 
              to="/auth/forgot-password" 
              class="text-sm text-medical-600 hover:text-medical-700 transition-colors"
            >
              Забыли пароль?
            </NuxtLink>
          </div>

          <UButton
            type="submit"
            size="lg"
            color="blue"
            variant="solid"
            class="w-full"
            :loading="isLoading"
          >
            Войти
          </UButton>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">или</span>
            </div>
          </div>

          <!-- Социальные сети -->
          <div class="grid grid-cols-2 gap-3">
            <UButton
              variant="outline"
              size="lg"
              @click="loginWithGoogle"
            >
              <Icon name="logos:google-icon" class="w-5 h-5 mr-2" />
              Google
            </UButton>
            <UButton
              variant="outline"
              size="lg"
              @click="loginWithApple"
            >
              <Icon name="logos:apple" class="w-5 h-5 mr-2" />
              Apple
            </UButton>
          </div>

          <div class="text-center">
            <span class="text-gray-600">Нет аккаунта? </span>
            <NuxtLink 
              to="/auth/register" 
              class="text-medical-600 hover:text-medical-700 font-semibold transition-colors"
            >
              Зарегистрироваться
            </NuxtLink>
          </div>
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Вход в аккаунт'
})

const router = useRouter()
const toast = useToast()

const showPassword = ref(false)
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Здесь будет реальная аутентификация
    toast.add({
      title: 'Добро пожаловать!',
      description: 'Вы успешно вошли в систему',
      color: 'green'
    })
    
    // Переход на главную страницу
    await router.push('/')
  } catch (error) {
    toast.add({
      title: 'Ошибка входа',
      description: 'Проверьте правильность email и пароля',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const loginWithGoogle = async () => {
  toast.add({
    title: 'В разработке',
    description: 'Вход через Google скоро будет доступен',
    color: 'yellow'
  })
}

const loginWithApple = async () => {
  toast.add({
    title: 'В разработке', 
    description: 'Вход через Apple скоро будет доступен',
    color: 'yellow'
  })
}
</script>
