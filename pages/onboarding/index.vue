<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Прогресс бар -->
    <div class="px-6 pt-12 pb-6">
      <div class="flex items-center justify-between mb-4">
        <UButton
          v-if="currentStep > 0"
          icon="heroicons:arrow-left"
          variant="ghost"
          @click="goToPreviousStep"
        />
        <div v-else class="w-10" /> <!-- Spacer -->
        
        <div class="flex space-x-2">
          <div
            v-for="(step, index) in onboardingSteps"
            :key="index"
            class="w-2 h-2 rounded-full transition-colors duration-300"
            :class="index <= currentStep ? 'bg-medical-500' : 'bg-gray-300'"
          />
        </div>
        
        <UButton
          v-if="currentStep < onboardingSteps.length - 1"
          variant="ghost"
          @click="skipOnboarding"
        >
          Пропустить
        </UButton>
        <div v-else class="w-16" /> <!-- Spacer -->
      </div>
    </div>

    <!-- Контент -->
    <div class="flex-1 flex flex-col justify-center px-6 pb-12">
      <div class="max-w-md mx-auto w-full text-center space-y-8">
        <!-- Иллюстрация -->
        <div class="w-80 h-80 mx-auto mb-8">
          <div 
            class="w-full h-full rounded-3xl flex items-center justify-center text-6xl transition-all duration-500"
            :class="onboardingSteps[currentStep].bgColor"
          >
            {{ onboardingSteps[currentStep].emoji }}
          </div>
        </div>

        <!-- Заголовок и описание -->
        <div class="space-y-4">
          <h1 class="text-3xl font-bold text-gray-900 leading-tight">
            {{ onboardingSteps[currentStep].title }}
          </h1>
          <p class="text-lg text-gray-600 leading-relaxed">
            {{ onboardingSteps[currentStep].description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Кнопки навигации -->
    <div class="px-6 pb-8 space-y-4">
      <UButton
        size="lg"
        color="blue"
        variant="solid"
        class="w-full"
        @click="goToNextStep"
      >
        {{ currentStep === onboardingSteps.length - 1 ? 'Начать' : 'Далее' }}
      </UButton>
      
      <div class="flex justify-center space-x-8">
        <UButton
          v-for="(step, index) in onboardingSteps"
          :key="index"
          variant="ghost"
          size="sm"
          class="w-3 h-3 rounded-full p-0"
          :class="index === currentStep ? 'bg-medical-500' : 'bg-gray-300'"
          @click="currentStep = index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Добро пожаловать',
  layout: false
})

const router = useRouter()
const currentStep = ref(0)

const onboardingSteps = [
  {
    emoji: '👩‍⚕️',
    title: 'Найдите своего врача',
    description: 'Более 1000 сертифицированных специалистов готовы помочь вам с любыми вопросами здоровья',
    bgColor: 'bg-blue-50'
  },
  {
    emoji: '📱',
    title: 'Консультации онлайн',
    description: 'Получайте профессиональные консультации через видеозвонки, не выходя из дома',
    bgColor: 'bg-green-50'
  },
  {
    emoji: '💊',
    title: 'Заказ лекарств',
    description: 'Находите ближайшие аптеки и заказывайте лекарства с доставкой на дом',
    bgColor: 'bg-purple-50'
  },
  {
    emoji: '📋',
    title: 'Медицинские записи',
    description: 'Ведите историю болезни, сохраняйте рецепты и результаты анализов в одном месте',
    bgColor: 'bg-orange-50'
  }
]

const goToNextStep = () => {
  if (currentStep.value < onboardingSteps.length - 1) {
    currentStep.value++
  } else {
    completeOnboarding()
  }
}

const goToPreviousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const skipOnboarding = () => {
  completeOnboarding()
}

const completeOnboarding = () => {
  // Сохраняем в localStorage что онбординг пройден
  if (process.client) {
    localStorage.setItem('onboarding-completed', 'true')
  }
  
  // Переходим на главную страницу
  router.push('/')
}

// Swipe functionality для мобильных устройств
let startX = 0
let startY = 0

const handleTouchStart = (event: TouchEvent) => {
  startX = event.touches[0].clientX
  startY = event.touches[0].clientY
}

const handleTouchEnd = (event: TouchEvent) => {
  if (!startX || !startY) return
  
  const endX = event.changedTouches[0].clientX
  const endY = event.changedTouches[0].clientY
  
  const diffX = startX - endX
  const diffY = startY - endY
  
  // Проверяем что свайп горизонтальный
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 50) {
      // Свайп влево - следующий слайд
      goToNextStep()
    } else if (diffX < -50) {
      // Свайп вправо - предыдущий слайд
      goToPreviousStep()
    }
  }
  
  startX = 0
  startY = 0
}

onMounted(() => {
  if (process.client) {
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
  }
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>
