<template>
  <div>
    <div class="bg-gray-100 rounded-xl p-1">
      <div class="swiper" ref="swiperRef">
        <div class="swiper-wrapper">
          <div
            v-for="(filter, index) in filters"
            :key="filter.value"
            class="swiper-slide"
          >
            <button
              class="py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper } from 'swiper'
import { FreeMode } from 'swiper/modules'

interface Filter {
  label: string
  value: string
  count?: number
}

interface Props {
  filters: Filter[]
  activeFilter: string
  spaceBetween?: number
  freeMode?: boolean
}

interface Emits {
  (e: 'filter-change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  spaceBetween: 4,
  freeMode: true
})

defineEmits<Emits>()

const swiperRef = ref<HTMLElement>()
const swiperInstance = ref<Swiper | null>(null)

onMounted(() => {
  if (swiperRef.value) {
    swiperInstance.value = new Swiper(swiperRef.value, {
      modules: [FreeMode],
      slidesPerView: 'auto',
      spaceBetween: props.spaceBetween,
      freeMode: props.freeMode,
      grabCursor: true,
    })
  }
})

onUnmounted(() => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy(true, true)
  }
})
</script>

<style scoped>
.swiper {
  width: 100%;
  height: auto;
}

.swiper-slide {
  width: auto;
  height: auto;
}
</style>
