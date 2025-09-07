<template>
  <div class="bg-white px-4 py-3 border-b border-gray-100">
    <div class="bg-gray-100 rounded-xl p-1 overflow-x-auto">
      <div class="flex space-x-1 min-w-max">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
          :class="activeFilter === filter.value 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'"
          @click="$emit('filter-change', filter.value)"
        >
          {{ filter.label }}
          <UBadge
            v-if="filter.count !== undefined && filter.count > 0"
            :label="filter.count.toString()"
            color="gray"
            size="xs"
            class="ml-2"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Filter {
  label: string
  value: string
  count?: number
}

interface Props {
  filters: Filter[]
  activeFilter: string
}

interface Emits {
  (e: 'filter-change', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
