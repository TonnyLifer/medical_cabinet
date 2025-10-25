<template>
  <div class="bg-background-light font-display text-text-light">
    <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div class="layout-container flex h-full grow flex-col">
        <div class="booking-mobile-padding px-3 sm:px-6 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-4xl flex-1">
            
            <!-- Progress Bar (не показываем на первом шаге) -->
            <div v-if="currentStep > 0" class="p-4 mb-6">
              <div class="w-full bg-neutral-light rounded-full h-2.5">
                <div class="bg-primary h-2.5 rounded-full transition-all duration-300" :style="`width: ${progressPercentage}%`"></div>
              </div>
            </div>

            <!-- Step Content -->
            <div class="booking-content-padding flex flex-col gap-4 p-2 sm:p-4">
              <!-- Header -->
              <div class="flex items-center justify-between">
                <h1 class="booking-title text-4xl font-black leading-tight tracking-[-0.033em]">{{ currentStepTitle }}</h1>
                <button v-if="currentStep > 0" class="text-text-light" @click="goBack">
                  <Icon name="material-symbols:arrow-back" class="w-6 h-6" />
                </button>
              </div>

              <!-- Step 1: Specialty Selection -->
              <BookingStepsSpecialtySelection v-if="currentStep === 0" @next="nextStep" />

              <!-- Step 2: Date and Time Selection -->
              <BookingStepsDateTimeSelection v-if="currentStep === 1" @next="nextStep" />

              <!-- Step 3: Confirmation -->
              <BookingStepsConfirmationStep v-if="currentStep === 2" @confirm="handleConfirm" @restart="handleRestart" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const bookingStore = useBookingStore()

// Текущий шаг
const currentStep = ref(0)

// Вычисляемые свойства
const progressPercentage = computed(() => {
  return (currentStep.value / 2) * 100
})

const currentStepTitle = computed(() => {
  const titles = [
    'Выберите врача, услугу или специализацию',
    'Выбор даты и времени',
    'Подтверждение записи'
  ]
  return titles[currentStep.value]
})

// Методы
const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleConfirm = (data: any) => {
  console.log('Подтверждение записи:', data)
  // Здесь будет логика подтверждения
  // После успешного подтверждения можно очистить store:
  // bookingStore.clearBooking()
}

const handleRestart = () => {
  // Возвращаемся к первому шагу
  currentStep.value = 0
}
</script>
