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
            <h1 class="text-2xl font-bold text-gray-900">Создать аккаунт</h1>
            <p class="text-gray-600 mt-2">Присоединяйтесь к Medicly</p>
          </div>
        </div>

        <!-- Форма регистрации -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Полное имя
              </label>
              <UInput
                v-model="registerForm.fullName"
                type="text"
                placeholder="Иван Иванов"
                size="lg"
                class="w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <UInput
                v-model="registerForm.email"
                type="email"
                placeholder="your@email.com"
                size="lg"
                class="w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <UInput
                v-model="registerForm.phone"
                type="tel"
                placeholder="+7 (999) 999-99-99"
                size="lg"
                class="w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <UInput
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Минимум 8 символов"
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
              <div class="mt-2">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-1">
                    <div 
                      class="h-1 rounded-full transition-all duration-300"
                      :class="passwordStrengthColor"
                      :style="{ width: passwordStrengthWidth }"
                    />
                  </div>
                  <span class="text-xs text-gray-500">{{ passwordStrengthText }}</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <UInput
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Повторите пароль"
                size="lg"
                class="w-full"
                required
              >
                <template #trailing>
                  <UButton
                    :icon="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                    variant="ghost"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </UInput>
              <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">
                Пароли не совпадают
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <UCheckbox 
              v-model="registerForm.agreeTerms" 
              required
            >
              <template #label>
                <span class="text-sm text-gray-600">
                  Я согласен с 
                  <NuxtLink to="/terms" class="text-medical-600 hover:underline">
                    Условиями использования
                  </NuxtLink>
                  и 
                  <NuxtLink to="/privacy" class="text-medical-600 hover:underline">
                    Политикой конфиденциальности
                  </NuxtLink>
                </span>
              </template>
            </UCheckbox>

            <UCheckbox v-model="registerForm.agreeNewsletter">
              <template #label>
                <span class="text-sm text-gray-600">
                  Получать новости и рекомендации по здоровью
                </span>
              </template>
            </UCheckbox>
          </div>

          <UButton
            type="submit"
            size="lg"
            color="blue"
            variant="solid"
            class="w-full"
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            Создать аккаунт
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
              @click="registerWithGoogle"
            >
              <Icon name="logos:google-icon" class="w-5 h-5 mr-2" />
              Google
            </UButton>
            <UButton
              variant="outline"
              size="lg"
              @click="registerWithApple"
            >
              <Icon name="logos:apple" class="w-5 h-5 mr-2" />
              Apple
            </UButton>
          </div>

          <div class="text-center">
            <span class="text-gray-600">Уже есть аккаунт? </span>
            <NuxtLink 
              to="/auth/login" 
              class="text-medical-600 hover:text-medical-700 font-semibold transition-colors"
            >
              Войти
            </NuxtLink>
          </div>
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Регистрация'
})

const router = useRouter()
const toast = useToast()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const registerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  agreeNewsletter: false
})

// Валидация пароля
const passwordStrength = computed(() => {
  const password = registerForm.password
  let score = 0
  
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  return score
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1: return 'Слабый'
    case 2: return 'Средний'
    case 3: return 'Хороший'
    case 4: return 'Отличный'
    default: return ''
  }
})

const passwordStrengthColor = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1: return 'bg-red-500'
    case 2: return 'bg-yellow-500'
    case 3: return 'bg-blue-500'
    case 4: return 'bg-green-500'
    default: return 'bg-gray-300'
  }
})

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 4) * 100}%`
})

const passwordMismatch = computed(() => {
  return registerForm.confirmPassword && 
         registerForm.password !== registerForm.confirmPassword
})

const isFormValid = computed(() => {
  return registerForm.fullName &&
         registerForm.email &&
         registerForm.phone &&
         registerForm.password &&
         registerForm.confirmPassword &&
         registerForm.password === registerForm.confirmPassword &&
         passwordStrength.value >= 2 &&
         registerForm.agreeTerms
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.add({
      title: 'Регистрация успешна!',
      description: 'Добро пожаловать в Medicly',
      color: 'green'
    })
    
    // Переход на онбординг или главную
    await router.push('/onboarding')
  } catch (error) {
    toast.add({
      title: 'Ошибка регистрации',
      description: 'Попробуйте еще раз или обратитесь в поддержку',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const registerWithGoogle = async () => {
  toast.add({
    title: 'В разработке',
    description: 'Регистрация через Google скоро будет доступна',
    color: 'yellow'
  })
}

const registerWithApple = async () => {
  toast.add({
    title: 'В разработке',
    description: 'Регистрация через Apple скоро будет доступна',
    color: 'yellow'
  })
}
</script>
