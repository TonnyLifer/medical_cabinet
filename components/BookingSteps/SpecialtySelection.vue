<template>
  <div class="space-y-6">
    <!-- Search Options -->
    <div class="bg-white p-6 rounded-xl shadow-lg border border-border-light flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <button class="flex-1 flex items-center justify-center gap-3 p-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300" @click="selectCategory('service')">
          <Icon name="material-symbols:search" class="w-5 h-5" />
          <span class="font-semibold">Поиск услуги</span>
        </button>
        <button class="flex-1 flex items-center justify-center gap-3 p-4 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors duration-300" @click="selectCategory('doctor')">
          <Icon name="material-symbols:person-search" class="w-5 h-5" />
          <span class="font-semibold">Поиск врача</span>
        </button>
      </div>

      <div class="relative flex items-center justify-center">
        <div class="h-px bg-border-light w-full"></div>
        <span class="absolute bg-white px-2 text-gray-500">или</span>
      </div>

      <div class="relative">
        <label class="sr-only" for="specialization">Выберите специализацию</label>
        <select class="form-select appearance-none w-full p-4 pl-12 rounded-lg border border-border-light focus:ring-2 focus:ring-primary focus:border-primary bg-background-light text-text-light cursor-pointer" id="specialization" @change="selectSpecialtyFromDropdown">
          <option disabled selected>Выберите специализацию</option>
          <option v-for="specialty in specialties" :key="specialty.name" :value="specialty.name">{{ specialty.name }}</option>
        </select>
        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Icon name="material-symbols:medical-information" class="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>

    <!-- Popular Specializations -->
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Популярные направления</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <div v-for="specialty in specialties" :key="specialty.name" 
           class="group cursor-pointer rounded-xl border border-border-light bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center"
           :class="specialty.hoverBorder"
           @click="selectSpecialty(specialty.name)">
          <div class="p-4 rounded-xl mb-3" :class="specialty.bgColor">
            <Icon :name="specialty.icon" class="text-4xl" :class="specialty.textColor" />
          </div>
          <h3 class="text-base font-bold">{{ specialty.name }}</h3>
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

// Данные специализаций
const specialties = [
  {
    name: 'Кардиолог',
    icon: 'material-symbols:ecg-heart',
    bgColor: 'bg-blue-100',
    textColor: 'text-primary',
    hoverBorder: 'hover:border-primary'
  },
  {
    name: 'Невролог',
    icon: 'material-symbols:neurology',
    bgColor: 'bg-red-100',
    textColor: 'text-danger',
    hoverBorder: 'hover:border-danger'
  },
  {
    name: 'Дерматолог',
    icon: 'material-symbols:dermatology',
    bgColor: 'bg-green-100',
    textColor: 'text-success',
    hoverBorder: 'hover:border-success'
  },
  {
    name: 'Педиатр',
    icon: 'material-symbols:child-care',
    bgColor: 'bg-blue-100',
    textColor: 'text-primary',
    hoverBorder: 'hover:border-primary'
  },
  {
    name: 'Стоматолог',
    icon: 'material-symbols:dentistry',
    bgColor: 'bg-red-100',
    textColor: 'text-danger',
    hoverBorder: 'hover:border-danger'
  },
  {
    name: 'Терапевт',
    icon: 'material-symbols:health-and-safety',
    bgColor: 'bg-green-100',
    textColor: 'text-success',
    hoverBorder: 'hover:border-success'
  },
  {
    name: 'Офтальмолог',
    icon: 'material-symbols:ophthalmology',
    bgColor: 'bg-blue-100',
    textColor: 'text-primary',
    hoverBorder: 'hover:border-primary'
  },
  {
    name: 'ЛОР',
    icon: 'material-symbols:ent',
    bgColor: 'bg-red-100',
    textColor: 'text-danger',
    hoverBorder: 'hover:border-danger'
  }
]

const selectCategory = (category: string) => {
  bookingStore.setSelectedCategory(category)
  emit('next')
}

const selectSpecialty = (specialtyName: string) => {
  bookingStore.setSelectedSpecialty(specialtyName)
  bookingStore.setSelectedCategory(specialtyName)
  emit('next')
}

const selectSpecialtyFromDropdown = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value) {
    selectSpecialty(target.value)
  }
}
</script>
