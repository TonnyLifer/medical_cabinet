<template>
  <div class="space-y-6">
    <!-- Selected Specialty -->
    <div class="bg-neutral-light/50 p-4 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="material-symbols:stethoscope" class="w-5 h-5 text-primary" />
        <span class="font-semibold">{{ bookingStore.selectedSpecialty || 'Кардиолог' }}</span>
      </div>
      <Icon name="material-symbols:expand-more" class="w-5 h-5 text-gray-400" />
    </div>

    <!-- Calendar -->
    <div class="p-4">
      <p class="text-lg font-semibold mb-4">Октябрь 2025</p>
      <div class="flex items-center justify-between gap-2">
        <button class="p-2 rounded-full hover:bg-neutral-light shrink-0">
          <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
        </button>
        <div class="flex-1">
          <!-- Mobile: 3 дня -->
          <div class="flex items-center justify-center space-x-2 sm:hidden">
            <div class="flex-shrink-0 text-center p-2 rounded-md w-16 bg-accent text-white">
              <p class="text-xs font-bold">ВТ</p>
              <p class="font-bold text-sm">22</p>
            </div>
            <div class="flex-shrink-0 text-center p-2 rounded-md w-16 hover:bg-neutral-light cursor-pointer">
              <p class="text-xs text-gray-500">СР</p>
              <p class="font-bold text-sm">23</p>
            </div>
            <div class="flex-shrink-0 text-center p-2 rounded-md w-16 hover:bg-neutral-light cursor-pointer">
              <p class="text-xs text-gray-500">ЧТ</p>
              <p class="font-bold text-sm">24</p>
            </div>
          </div>
          <!-- Desktop: все дни -->
          <div class="hidden sm:flex items-center justify-center space-x-2">
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 bg-accent text-white">
              <p class="text-sm font-bold">ВТ</p>
              <p class="font-bold text-lg">22</p>
            </div>
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 hover:bg-neutral-light cursor-pointer">
              <p class="text-sm text-gray-500">СР</p>
              <p class="font-bold text-lg">23</p>
            </div>
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 hover:bg-neutral-light cursor-pointer">
              <p class="text-sm text-gray-500">ЧТ</p>
              <p class="font-bold text-lg">24</p>
            </div>
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 hover:bg-neutral-light cursor-pointer">
              <p class="text-sm text-gray-500">ПТ</p>
              <p class="font-bold text-lg">25</p>
            </div>
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 text-gray-400 cursor-not-allowed">
              <p class="text-sm">СБ</p>
              <p class="font-bold text-lg">26</p>
            </div>
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 text-gray-400 cursor-not-allowed">
              <p class="text-sm">ВС</p>
              <p class="font-bold text-lg">27</p>
            </div>
            <div class="flex-shrink-0 text-center p-3 rounded-md w-16 hover:bg-neutral-light cursor-pointer">
              <p class="text-sm text-gray-500">ПН</p>
              <p class="font-bold text-lg">28</p>
            </div>
          </div>
        </div>
        <button class="p-2 rounded-full hover:bg-neutral-light shrink-0">
          <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Time Slots -->
    <div class="space-y-4">
      <p class="text-lg font-semibold">{{ selectedDateText }}</p>
      
      <!-- Doctors -->
      <div v-for="doctor in doctors" :key="doctor.id" class="bg-neutral-light/50 p-4 rounded-lg">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1 min-w-0 pr-2">
            <h3 class="font-bold text-base sm:text-lg">{{ doctor.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-500">{{ doctor.specialty }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-md font-semibold text-xs sm:text-sm whitespace-nowrap">
              {{ doctor.price }} ₽
            </div>
            <img :alt="doctor.name" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover" :src="doctor.photo" />
          </div>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
          <button 
            v-for="slot in doctor.timeSlots" 
            :key="slot.time"
            class="p-2 sm:p-3 rounded-md text-center font-semibold text-xs sm:text-base transition-all duration-300"
            :class="getSlotClasses(slot)"
            @click="selectTimeSlot(doctor.id, slot.time)"
          >
            {{ slot.time }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const bookingStore = useBookingStore()
const emit = defineEmits<{
  next: []
}>()

// Данные для шагов
const selectedDate = ref('22')
const selectedTimeSlot = ref<{doctorId: string, time: string} | null>(null)
const selectedDateText = ref('Вторник, 22 октября')

// Данные врачей
const doctors = ref([
  {
    id: 'doctor-1',
    name: 'Д-р. Анна Ковалёва',
    specialty: 'Кардиолог',
    price: 2500,
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8bBJgraNEGDe2pf6D_zw2YIdT4nilELlorMkZ9Y0XyLKeiGWuoDs2EQJbN7Kp8xrrNsl3Yg2P6awqa-69NRzobb7XRYbaAkOzpTmWL9fucSHqt_IuVumIdEbtPQVsqRw_nU63AXqW3X5jHZC0-6UABKWBbgLZoQAMnDx1SURKF4qb28V0MJk9JuduSKwh0XRIuQUkYac9nOkhTkpMINUN6daDXSU237RtJApGButqrf1j6BmXmNJRkQaM6C2uS3o14l_6Q4QOtSfI',
    timeSlots: [
      { time: '09:00', status: 'available' },
      { time: '09:30', status: 'available' },
      { time: '10:30', status: 'available' }
    ]
  },
  {
    id: 'doctor-2',
    name: 'Д-р. Иван Петров',
    specialty: 'Кардиолог',
    price: 3000,
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD41X0M_qLzyTDyt4myZTCTtKZo8YYedlpZTu8seQL28hKbo_gVph6MTSgibRYsDtvVNpuN1CIKxEv8nqcVTSk8JukMeG7gst66tPUZQ_WvcukP0JOzH742Nw0CdU0DMtUS3hhZRS6eZebN7vB8NSz1xFWiEB5kM-sLEJAakdu4HL3hHlroi5ticCLR50FFLKj3GdPf9RBUHuaUGURFqovjDMAHdr_MFAGC9Jcdy_D2cGuoQSn0-sj9tXTQ9p0R-uX4TmWrUEucMPa9',
    timeSlots: [
      { time: '14:00', status: 'available' },
      { time: '14:30', status: 'available' },
      { time: '15:30', status: 'available' },
      { time: '16:00', status: 'available' },
    ]
  }
])

const getSlotClasses = (slot: {time: string, status: string}) => {
  if (selectedTimeSlot.value?.time === slot.time) {
    return 'bg-accent text-white font-bold'
  }
  return 'bg-secondary/30 hover:bg-secondary/30'
}

const selectTimeSlot = (doctorId: string, time: string) => {
  selectedTimeSlot.value = { doctorId, time }
  
  // Находим врача по ID
  const doctor = doctors.value.find(d => d.id === doctorId)
  if (doctor) {
    // Сохраняем выбранного врача, дату и время в store
    bookingStore.setSelectedDoctor({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      price: doctor.price
    })
    bookingStore.setSelectedDate(selectedDateText.value)
    bookingStore.setSelectedTime(time)
  }
  
  // Переход на следующий шаг
  emit('next')
}
</script>
