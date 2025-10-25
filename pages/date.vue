<template>
  <div class="bg-background-light font-display text-text-light">
    <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div class="layout-container flex h-full grow flex-col">
        <div class="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-4xl flex-1">
            
            <!-- Progress Bar -->
            <div class="p-4 mb-6">
              <div class="w-full bg-neutral-light rounded-full h-2.5">
                <div class="bg-primary h-2.5 rounded-full" style="width: 50%"></div>
              </div>
            </div>

            <div class="flex flex-col gap-4 p-4">
              <!-- Header -->
              <div class="flex items-center justify-between">
                <h1 class="text-4xl font-black leading-tight tracking-[-0.033em]">Выбор даты и времени</h1>
                <button class="text-text-light">
                  <Icon name="material-symbols:arrow-back" class="w-6 h-6" />
                </button>
              </div>

              <!-- Filters -->
              <div class="bg-neutral-light/50 p-4 rounded-lg flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Icon name="material-symbols:stethoscope" class="w-5 h-5 text-primary" />
                  <span class="font-semibold">Кардиолог</span>
                </div>
                <Icon name="material-symbols:expand-more" class="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <!-- Calendar -->
            <div class="p-4">
              <p class="text-lg font-semibold mb-4">Октябрь 2025</p>
              <div class="flex items-center justify-between">
                <button class="p-2 rounded-full hover:bg-neutral-light">
                  <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
                </button>
                <div class="flex-1 overflow-hidden">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="flex-shrink-0 text-center p-3 rounded-md w-16">
                      <p class="text-sm text-gray-500">ПН</p>
                      <p class="font-bold text-lg">21</p>
                    </div>
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
                <button class="p-2 rounded-full hover:bg-neutral-light">
                  <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Time Slots -->
            <div class="p-4 space-y-4">
              <p class="text-lg font-semibold">{{ selectedDateText }}</p>
              
              <!-- Doctors -->
              <div v-for="doctor in doctors" :key="doctor.id" class="bg-neutral-light/50 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold text-lg">{{ doctor.name }}</h3>
                    <p class="text-sm text-gray-500">{{ doctor.specialty }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="bg-yellow-500 text-white px-3 py-1 rounded-md font-semibold">
                      {{ doctor.price }} ₽
                    </div>
                    <img :alt="doctor.name" class="w-16 h-16 rounded-full object-cover" :src="doctor.photo" />
                  </div>
                </div>
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  <button 
                    v-for="slot in doctor.timeSlots" 
                    :key="slot.time"
                    class="p-3 rounded-md text-center font-semibold transition-all duration-300"
                    :class="getSlotClasses(slot)"
                    @click="selectTimeSlot(doctor.id, slot.time)"
                  >
                    {{ slot.time }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Выбор даты и времени'
})

// Реактивные данные
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

// Функция для получения классов кнопки слота
const getSlotClasses = (slot: {time: string, status: string}) => {
  
  if (selectedTimeSlot.value?.time === slot.time) {
    return 'bg-accent text-white font-bold'
  }
  
  return 'bg-secondary/30 hover:bg-secondary/30'
}

// Функция выбора временного слота
const selectTimeSlot = (doctorId: string, time: string) => {
  selectedTimeSlot.value = { doctorId, time }
}
</script>

