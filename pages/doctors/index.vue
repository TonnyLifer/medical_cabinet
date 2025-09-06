<template>
  <div>
    <!-- Хедер с поиском -->
    <div class="bg-white px-4 py-4 border-b border-gray-100">
      <div class="flex items-center space-x-3 mb-4">
        <UButton
          icon="heroicons:arrow-left"
          variant="ghost"
          @click="$router.back()"
        />
        <h1 class="text-xl font-semibold text-gray-900 flex-1">Врачи</h1>
        <UButton
          icon="heroicons:adjustments-horizontal"
          variant="ghost"
          @click="isFilterOpen = true"
        />
      </div>
      
      <UInput
        v-model="searchQuery"
        placeholder="Поиск врача или специальности..."
        size="lg"
        class="w-full"
      >
        <template #leading>
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
        </template>
      </UInput>
    </div>

    <!-- Фильтры -->
    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex items-center space-x-3 overflow-x-auto">
        <UButton
          v-for="filter in quickFilters"
          :key="filter.value"
          :variant="activeFilters.includes(filter.value) ? 'solid' : 'outline'"
          :color="activeFilters.includes(filter.value) ? 'blue' : 'gray'"
          size="sm"
          @click="toggleFilter(filter.value)"
        >
          {{ filter.label }}
        </UButton>
      </div>
    </div>

    <!-- Список врачей -->
    <div class="px-4 py-4 space-y-4">
      <div
        v-for="doctor in filteredDoctors"
        :key="doctor.id"
        class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        @click="$router.push(`/doctors/${doctor.id}`)"
      >
        <div class="flex items-start space-x-4">
          <!-- Аватар -->
          <div class="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon name="heroicons:user" class="w-10 h-10 text-gray-500" />
          </div>

          <!-- Информация о враче -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 text-lg">{{ doctor.name }}</h3>
                <p class="text-medical-600 font-medium">{{ doctor.speciality }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ doctor.experience }} лет опыта</p>
              </div>
              
              <!-- Статус онлайн -->
              <div v-if="doctor.isOnline" class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-xs text-green-600 font-medium">Онлайн</span>
              </div>
            </div>

            <!-- Рейтинг и цена -->
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm font-medium">{{ doctor.rating }}</span>
                  <span class="text-sm text-gray-500">({{ doctor.reviewsCount }})</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">{{ doctor.price }}₽</p>
                <p class="text-xs text-gray-500">за консультацию</p>
              </div>
            </div>

            <!-- Ближайшее время -->
            <div v-if="getNextAvailableSlot(doctor)" class="mt-3 p-2 bg-green-50 rounded-lg">
              <p class="text-sm text-green-700">
                <Icon name="heroicons:clock" class="w-4 h-4 inline mr-1" />
                Ближайшее время: {{ getNextAvailableSlot(doctor) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-500"></div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="!isLoading && filteredDoctors.length === 0" class="text-center py-12">
        <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Врачи не найдены</h3>
        <p class="text-gray-600">Попробуйте изменить параметры поиска</p>
      </div>
    </div>

    <!-- Модальное окно фильтров -->
    <UModal v-model="isFilterOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-6">Фильтры</h3>
        
        <!-- Специальность -->
        <div class="mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Специальность</h4>
          <div class="grid grid-cols-2 gap-2">
            <UCheckbox
              v-for="specialty in specialties"
              :key="specialty"
              v-model="selectedSpecialties"
              :value="specialty"
              :label="specialty"
            />
          </div>
        </div>

        <!-- Цена -->
        <div class="mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Цена</h4>
          <div class="space-y-2">
            <URadio
              v-model="priceRange"
              value="all"
              label="Любая цена"
            />
            <URadio
              v-model="priceRange"
              value="0-2000"
              label="До 2000₽"
            />
            <URadio
              v-model="priceRange"
              value="2000-5000"
              label="2000₽ - 5000₽"
            />
            <URadio
              v-model="priceRange"
              value="5000+"
              label="От 5000₽"
            />
          </div>
        </div>

        <!-- Рейтинг -->
        <div class="mb-6">
          <h4 class="font-medium text-gray-900 mb-3">Минимальный рейтинг</h4>
          <div class="space-y-2">
            <URadio
              v-model="minRating"
              value="0"
              label="Любой рейтинг"
            />
            <URadio
              v-model="minRating"
              value="4"
              label="4+ звезды"
            />
            <URadio
              v-model="minRating"
              value="4.5"
              label="4.5+ звезды"
            />
          </div>
        </div>

        <!-- Доступность -->
        <div class="mb-6">
          <UCheckbox
            v-model="onlineOnly"
            label="Только онлайн врачи"
          />
        </div>

        <!-- Кнопки -->
        <div class="flex space-x-3">
          <UButton
            variant="outline"
            class="flex-1"
            @click="resetFilters"
          >
            Сбросить
          </UButton>
          <UButton
            color="blue"
            class="flex-1"
            @click="applyFilters"
          >
            Применить
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Doctor } from '~/types'

definePageMeta({
  title: 'Врачи'
})

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const isFilterOpen = ref(false)
const isLoading = ref(false)
const activeFilters = ref<string[]>([])

// Фильтры
const selectedSpecialties = ref<string[]>([])
const priceRange = ref('all')
const minRating = ref('0')
const onlineOnly = ref(false)

const quickFilters = [
  { label: 'Онлайн', value: 'online' },
  { label: 'Сегодня', value: 'today' },
  { label: 'Высокий рейтинг', value: 'top-rated' },
  { label: 'Недорого', value: 'affordable' }
]

const specialties = [
  'Терапевт',
  'Кардиолог', 
  'Невролог',
  'Дерматолог',
  'Педиатр',
  'Гинеколог',
  'Офтальмолог',
  'ЛОР'
]

// Моковые данные врачей
const allDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Др. Иванова Анна Сергеевна',
    speciality: 'Кардиолог',
    rating: 4.9,
    reviewsCount: 247,
    experience: 15,
    price: 2500,
    about: 'Опытный кардиолог с международной сертификацией',
    education: ['МГУ им. Ломоносова', 'Стажировка в Германии'],
    availableSlots: [
      { id: '1', date: '2024-01-16', time: '14:00', isAvailable: true },
      { id: '2', date: '2024-01-16', time: '16:00', isAvailable: true }
    ],
    isOnline: true
  },
  {
    id: '2',
    name: 'Др. Петров Сергей Иванович',
    speciality: 'Терапевт',
    rating: 4.8,
    reviewsCount: 189,
    experience: 12,
    price: 2000,
    about: 'Врач общей практики с большим опытом',
    education: ['РНИМУ им. Пирогова'],
    availableSlots: [
      { id: '3', date: '2024-01-17', time: '10:00', isAvailable: true }
    ],
    isOnline: false
  },
  {
    id: '3',
    name: 'Др. Сидорова Мария Петровна',
    speciality: 'Невролог',
    rating: 4.9,
    reviewsCount: 156,
    experience: 18,
    price: 3000,
    about: 'Специалист по неврологическим заболеваниям',
    education: ['Бурденко НИИ нейрохирургии'],
    availableSlots: [
      { id: '4', date: '2024-01-16', time: '15:30', isAvailable: true }
    ],
    isOnline: true
  },
  {
    id: '4',
    name: 'Др. Козлов Алексей Михайлович',
    speciality: 'Дерматолог',
    rating: 4.7,
    reviewsCount: 203,
    experience: 10,
    price: 2200,
    about: 'Специалист по кожным заболеваниям',
    education: ['МГМСУ'],
    availableSlots: [],
    isOnline: true
  }
]

const filteredDoctors = computed(() => {
  let result = [...allDoctors]
  
  // Поиск по имени или специальности
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(doctor => 
      doctor.name.toLowerCase().includes(query) ||
      doctor.speciality.toLowerCase().includes(query)
    )
  }
  
  // Фильтр по специальности из URL
  const specialtyFromUrl = route.query.specialty
  if (specialtyFromUrl) {
    result = result.filter(doctor => 
      doctor.speciality.toLowerCase() === specialtyFromUrl.toString().toLowerCase()
    )
  }
  
  // Выбранные специальности
  if (selectedSpecialties.value.length > 0) {
    result = result.filter(doctor => 
      selectedSpecialties.value.includes(doctor.speciality)
    )
  }
  
  // Ценовой диапазон
  if (priceRange.value !== 'all') {
    const [min, max] = priceRange.value.includes('+') 
      ? [parseInt(priceRange.value), Infinity]
      : priceRange.value.split('-').map(Number)
    
    result = result.filter(doctor => 
      doctor.price >= min && doctor.price <= max
    )
  }
  
  // Минимальный рейтинг
  if (minRating.value !== '0') {
    result = result.filter(doctor => 
      doctor.rating >= parseFloat(minRating.value)
    )
  }
  
  // Только онлайн врачи
  if (onlineOnly.value) {
    result = result.filter(doctor => doctor.isOnline)
  }
  
  // Быстрые фильтры
  if (activeFilters.value.includes('online')) {
    result = result.filter(doctor => doctor.isOnline)
  }
  
  if (activeFilters.value.includes('top-rated')) {
    result = result.filter(doctor => doctor.rating >= 4.8)
  }
  
  if (activeFilters.value.includes('affordable')) {
    result = result.filter(doctor => doctor.price <= 2500)
  }
  
  if (activeFilters.value.includes('today')) {
    const today = new Date().toISOString().split('T')[0]
    result = result.filter(doctor => 
      doctor.availableSlots.some(slot => 
        slot.date === today && slot.isAvailable
      )
    )
  }
  
  return result
})

const toggleFilter = (filterValue: string) => {
  const index = activeFilters.value.indexOf(filterValue)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filterValue)
  }
}

const getNextAvailableSlot = (doctor: Doctor) => {
  const availableSlot = doctor.availableSlots.find(slot => slot.isAvailable)
  if (!availableSlot) return null
  
  const date = new Date(availableSlot.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
  
  return `${date} в ${availableSlot.time}`
}

const resetFilters = () => {
  selectedSpecialties.value = []
  priceRange.value = 'all'
  minRating.value = '0'
  onlineOnly.value = false
  activeFilters.value = []
  isFilterOpen.value = false
}

const applyFilters = () => {
  isFilterOpen.value = false
}

// Инициализация фильтров из URL
onMounted(() => {
  if (route.query.specialty) {
    selectedSpecialties.value = [route.query.specialty.toString()]
  }
  
  if (route.query.type === 'online') {
    activeFilters.value.push('online')
  }
})
</script>
