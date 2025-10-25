<template>
  <div class="space-y-6">
    <!-- Success Message -->
    <div v-if="isConfirmed" class="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
      <div class="flex items-center justify-center mb-4">
        <Icon name="material-symbols:check-circle" class="w-16 h-16 text-green-500" />
      </div>
      <h3 class="text-xl font-bold text-green-800 mb-2">Запись успешно подтверждена!</h3>
      <p class="text-green-700 mb-4">Мы отправили подтверждение на ваш номер телефона</p>
      <button 
        class="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        @click="startNewBooking"
      >
        Записаться ещё
      </button>
    </div>

    <!-- Appointment Info -->
    <div v-else class="bg-neutral-light/50 p-6 rounded-xl shadow-sm space-y-4">
      <div>
        <p class="text-lg font-bold">{{ appointment.doctorName }}</p>
        <p class="text-sm text-[#617c89]">{{ appointment.specialty }}</p>
      </div>
      <div class="border-t border-b border-gray-200 py-4 flex justify-between items-center">
        <p class="font-medium">{{ appointment.service }}</p>
        <span class="text-white font-bold bg-green-500 px-3 py-1 rounded-full text-sm">{{ appointment.price }} ₽</span>
      </div>
      <div>
        <p class="text-base">{{ appointment.date }} в {{ appointment.time }}</p>
        <p class="text-sm text-[#617c89] flex items-center gap-1.5">
          <Icon name="material-symbols:location-on" class="text-base" />
          {{ appointment.location }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <div v-if="!isConfirmed" class="bg-neutral-light/50 p-6 rounded-xl shadow-sm space-y-4">
      <!-- ФИО -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-[#111618] mb-1" for="lastname">Фамилия</label>
          <div class="relative">
            <input 
              class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-3 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
              id="lastname" 
              name="lastname" 
              placeholder="Иванов" 
              type="text"
              v-model="form.lastName"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-[#111618] mb-1" for="firstname">Имя</label>
          <div class="relative">
            <input 
              class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-3 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
              id="firstname" 
              name="firstname" 
              placeholder="Иван" 
              type="text"
              v-model="form.firstName"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-[#111618] mb-1" for="middlename">Отчество</label>
          <div class="relative">
            <input 
              class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-3 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
              id="middlename" 
              name="middlename" 
              placeholder="Иванович" 
              type="text"
              v-model="form.middleName"
            />
          </div>
        </div>
      </div>

      <!-- Телефон -->
      <div>
        <label class="block text-sm font-medium text-[#111618] mb-1" for="phone">Номер телефона</label>
        <div class="relative">
          <Icon name="material-symbols:call" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#617c89] w-5 h-5" />
          <input 
            class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-10 pr-3.5 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
            id="phone" 
            name="phone" 
            placeholder="+7 (999) 999-99-99" 
            type="tel"
            v-model="form.phone"
          />
        </div>
      </div>

      <!-- Дата рождения -->
      <div>
        <label class="block text-sm font-medium text-[#111618] mb-1" for="birthdate">Дата рождения</label>
        <div class="relative">
          <Icon name="material-symbols:calendar-today" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#617c89] w-5 h-5" />
          <input 
            class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-10 pr-3.5 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
            id="birthdate" 
            name="birthdate" 
            type="date"
            v-model="form.birthDate"
          />
        </div>
      </div>

      <!-- Email (дополнительно) -->
      <div>
        <label class="block text-sm font-medium text-[#111618] mb-1" for="email">Email (необязательно)</label>
        <div class="relative">
          <Icon name="material-symbols:mail" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#617c89] w-5 h-5" />
          <input 
            class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-10 pr-3.5 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
            id="email" 
            name="email" 
            placeholder="ivan@example.com" 
            type="email"
            v-model="form.email"
          />
        </div>
      </div>
    </div>

    <!-- Confirm Button -->
    <div v-if="!isConfirmed" class="pt-4">
      <button 
        class="w-full text-white bg-green-500 hover:bg-opacity-90 focus:ring-4 focus:ring-red-500/50 font-bold rounded-xl text-base px-8 py-4 text-center transition-colors" 
        type="submit"
        @click="confirmAppointment"
      >
        Подтвердить запись
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const bookingStore = useBookingStore()
const emit = defineEmits<{
  confirm: [data: any]
  restart: []
}>()

// Состояние подтверждения
const isConfirmed = ref(false)

// Форма
const form = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  phone: '',
  birthDate: '',
  email: ''
})

const appointment = computed(() => ({
  doctorName: bookingStore.selectedDoctor?.name || 'Иванов Иван Иванович',
  specialty: bookingStore.selectedDoctor?.specialty || 'Терапевт',
  service: 'Первичный приём',
  price: bookingStore.selectedDoctor?.price?.toString() || '2 500',
  date: bookingStore.selectedDate || '25 октября 2024, 14:30',
  time: bookingStore.selectedTime || '14:30',
  location: 'г. Вышний Волочек, ул. Красных печатников, д. 36'
}))

const confirmAppointment = () => {
  const data = {
    appointment: appointment.value,
    form: form.value
  }
  
  // Показываем сообщение об успехе
  isConfirmed.value = true
  
  // Отправляем событие родительскому компоненту
  emit('confirm', data)
}

const startNewBooking = () => {
  // Очищаем store и возвращаемся к началу
  bookingStore.clearBooking()
  isConfirmed.value = false
  emit('restart')
}
</script>
