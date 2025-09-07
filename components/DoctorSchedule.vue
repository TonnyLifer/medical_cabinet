<template>
  <div class="space-y-4">
    <!-- Выбор дня с FilterSwiperApp -->
    <FilterSwiperApp
      :filters="dateFilters"
      :active-filter="selectedDate"
      @filter-change="selectedDate = $event"
    />

    <!-- Выбор времени -->
    <div v-if="selectedDate">
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <h3 class="font-semibold text-gray-900 mb-4">Выберите время</h3>
        
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="slot in getSlotsForSelectedDate()"
            :key="slot.id"
            class="py-3 px-4 text-sm font-medium rounded-lg border transition-all flex items-center space-x-2"
            :class="selectedSlot?.id === slot.id
              ? 'bg-medical-500 text-white border-medical-500'
              : 'bg-white text-gray-700 border-gray-200 hover:border-medical-300'"
            :disabled="!slot.isAvailable"
            @click="$emit('slot-select', slot)"
          >
            <Icon name="heroicons:clock" class="w-4 h-4" />
            <span>{{ slot.time }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeSlot } from '~/types'

interface Props {
  availableSlots: TimeSlot[]
  selectedSlot: TimeSlot | null
}

interface Emits {
  (e: 'slot-select', slot: TimeSlot): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const selectedDate = ref<string>('')

const groupedSlots = computed(() => {
  const groups: Record<string, TimeSlot[]> = {}
  
  props.availableSlots
    .filter(slot => slot.isAvailable)
    .forEach(slot => {
      if (!groups[slot.date]) {
        groups[slot.date] = []
      }
      groups[slot.date].push(slot)
    })
  
  return groups
})

const dateFilters = computed(() => {
  return Object.entries(groupedSlots.value).map(([date, slots]) => ({
    label: formatDateShort(date),
    value: date,
    count: slots.length
  }))
})

const getSlotsForSelectedDate = () => {
  return selectedDate.value ? groupedSlots.value[selectedDate.value] || [] : []
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  })
}

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  })
}

// Автоматически выбираем первый доступный день
watch(groupedSlots, (newSlots) => {
  if (newSlots && Object.keys(newSlots).length > 0 && !selectedDate.value) {
    selectedDate.value = Object.keys(newSlots)[0]
  }
}, { immediate: true })
</script>
