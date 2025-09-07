<template>
  <div class="swiper" ref="swiperRef">
    <div class="swiper-wrapper">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="swiper-slide"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>
    
    <!-- Пагинация -->
    <div v-if="showPagination" class="swiper-pagination"></div>
    
    <!-- Навигация -->
    <div v-if="showNavigation" class="swiper-button-next"></div>
    <div v-if="showNavigation" class="swiper-button-prev"></div>
  </div>
</template>

<script setup lang="ts">
import { Swiper } from 'swiper'
import { Navigation, Pagination, FreeMode } from 'swiper/modules'

interface Props {
  items: any[]
  showPagination?: boolean
  showNavigation?: boolean
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  freeMode?: boolean
  breakpoints?: Record<number, any>
}

const props = withDefaults(defineProps<Props>(), {
  showPagination: false,
  showNavigation: false,
  slidesPerView: 'auto',
  spaceBetween: 16,
  freeMode: true,
  breakpoints: () => ({})
})

const swiperRef = ref<HTMLElement>()
const swiperInstance = ref<Swiper | null>(null)

onMounted(() => {
  if (swiperRef.value) {
    swiperInstance.value = new Swiper(swiperRef.value, {
      modules: [Navigation, Pagination, FreeMode],
      slidesPerView: props.slidesPerView,
      spaceBetween: props.spaceBetween,
      freeMode: props.freeMode,
      pagination: props.showPagination ? {
        el: '.swiper-pagination',
        clickable: true,
      } : false,
      navigation: props.showNavigation ? {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      } : false,
      breakpoints: props.breakpoints,
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

/* Кастомные стили для кнопок навигации */
.swiper-button-next,
.swiper-button-prev {
  color: #2563eb;
  width: 32px;
  height: 32px;
  margin-top: -16px;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 16px;
}

/* Кастомные стили для пагинации */
.swiper-pagination-bullet {
  background-color: #2563eb;
  opacity: 0.3;
}

.swiper-pagination-bullet-active {
  opacity: 1;
}
</style>