<template>
  <div>
    <NuxtLayout name="auth">
      <div class="bg-white rounded-3xl shadow-medical p-8 space-y-8">
        <!-- Логотип и заголовок -->
        <div class="text-center space-y-4">
          <div class="w-20 h-20 bg-medical-500 rounded-2xl mx-auto flex items-center justify-center">
            <Icon name="heroicons:key" class="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Восстановление пароля</h1>
            <p class="text-gray-600 mt-2">
              Введите email или телефон для получения кода восстановления
            </p>
          </div>
        </div>

        <!-- Шаг 1: Ввод email/телефона -->
        <div v-if="step === 1">
          <form @submit.prevent="sendResetCode" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email или телефон
              </label>
              <UInput
                v-model="resetForm.contact"
                type="text"
                placeholder="your@email.com или +7 (999) 999-99-99"
                size="lg"
                class="w-full"
                required
              />
            </div>

            <UButton
              type="submit"
              size="lg"
              color="blue"
              variant="solid"
              class="w-full"
              :loading="isLoading"
            >
              Отправить код
            </UButton>

            <div class="text-center">
              <NuxtLink 
                to="/auth/login" 
                class="text-medical-600 hover:text-medical-700 font-semibold transition-colors"
              >
                ← Вернуться к входу
              </NuxtLink>
            </div>
          </form>
        </div>

        <!-- Шаг 2: Ввод кода -->
        <div v-else-if="step === 2">
          <form @submit.prevent="verifyCode" class="space-y-6">
            <div class="text-center mb-6">
              <p class="text-gray-600">
                Код отправлен на {{ maskedContact }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Код подтверждения
              </label>
              <div class="flex justify-center space-x-2">
                <UInput
                  v-for="(digit, index) in verificationCode"
                  :key="index"
                  v-model="verificationCode[index]"
                  type="text"
                  maxlength="1"
                  class="w-12 h-12 text-center text-lg font-semibold"
                  @input="handleCodeInput(index, $event)"
                  @keydown="handleKeyDown(index, $event)"
                />
              </div>
            </div>

            <div class="text-center">
              <p class="text-gray-600 text-sm mb-2">
                Не получили код?
              </p>
              <UButton
                variant="ghost"
                color="blue"
                @click="resendCode"
                :disabled="resendTimer > 0"
              >
                {{ resendTimer > 0 ? `Повторить через ${resendTimer}с` : 'Отправить повторно' }}
              </UButton>
            </div>

            <UButton
              type="submit"
              size="lg"
              color="blue"
              variant="solid"
              class="w-full"
              :loading="isLoading"
              :disabled="!isCodeComplete"
            >
              Подтвердить код
            </UButton>
          </form>
        </div>

        <!-- Шаг 3: Новый пароль -->
        <div v-else-if="step === 3">
          <form @submit.prevent="resetPassword" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Новый пароль
                </label>
                <UInput
                  v-model="resetForm.newPassword"
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
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Подтвердите пароль
                </label>
                <UInput
                  v-model="resetForm.confirmPassword"
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

            <UButton
              type="submit"
              size="lg"
              color="blue"
              variant="solid"
              class="w-full"
              :loading="isLoading"
              :disabled="!isPasswordValid"
            >
              Сохранить пароль
            </UButton>
          </form>
        </div>

        <!-- Шаг 4: Успех -->
        <div v-else-if="step === 4" class="text-center space-y-6">
          <div class="w-20 h-20 bg-green-100 rounded-2xl mx-auto flex items-center justify-center">
            <Icon name="heroicons:check-circle" class="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Пароль изменен!</h2>
            <p class="text-gray-600 mt-2">
              Теперь вы можете войти с новым паролем
            </p>
          </div>
          <UButton
            size="lg"
            color="blue"
            variant="solid"
            class="w-full"
            @click="$router.push('/auth/login')"
          >
            Войти в аккаунт
          </UButton>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Восстановление пароля'
})

const router = useRouter()
const toast = useToast()

const step = ref(1)
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const resendTimer = ref(0)

const resetForm = reactive({
  contact: '',
  newPassword: '',
  confirmPassword: ''
})

const verificationCode = ref(Array(4).fill(''))

const maskedContact = computed(() => {
  const contact = resetForm.contact
  if (contact.includes('@')) {
    const [username, domain] = contact.split('@')
    return `${username.slice(0, 2)}***@${domain}`
  } else {
    return `${contact.slice(0, 4)}***${contact.slice(-2)}`
  }
})

const isCodeComplete = computed(() => {
  return verificationCode.value.every(digit => digit.length === 1)
})

const passwordMismatch = computed(() => {
  return resetForm.confirmPassword && 
         resetForm.newPassword !== resetForm.confirmPassword
})

const isPasswordValid = computed(() => {
  return resetForm.newPassword.length >= 8 &&
         resetForm.confirmPassword &&
         resetForm.newPassword === resetForm.confirmPassword
})

const sendResetCode = async () => {
  isLoading.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      title: 'Код отправлен',
      description: 'Проверьте ваш email или SMS',
      color: 'green'
    })
    
    step.value = 2
    startResendTimer()
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось отправить код. Попробуйте еще раз',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const verifyCode = async () => {
  isLoading.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    step.value = 3
  } catch (error) {
    toast.add({
      title: 'Неверный код',
      description: 'Проверьте код и попробуйте еще раз',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const resetPassword = async () => {
  if (!isPasswordValid.value) return
  
  isLoading.value = true
  
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    step.value = 4
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось сохранить пароль. Попробуйте еще раз',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const resendCode = () => {
  sendResetCode()
}

const startResendTimer = () => {
  resendTimer.value = 60
  const interval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const handleCodeInput = (index: number, event: any) => {
  const value = event.target.value
  if (value && index < verificationCode.value.length - 1) {
    // Автоматический переход к следующему полю
    const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input')
    if (nextInput) {
      nextInput.focus()
    }
  }
}

const handleKeyDown = (index: number, event: any) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    // Переход к предыдущему полю при удалении
    const prevInput = event.target.parentElement.previousElementSibling?.querySelector('input')
    if (prevInput) {
      prevInput.focus()
    }
  }
}
</script>
