<template>
  <div>
    <!-- Хедер -->
    <div class="bg-white px-4 py-4 border-b border-gray-100">
      <h1 class="text-xl font-semibold text-gray-900">Аптеки</h1>
    </div>

    <!-- Поиск и фильтры -->
    <div class="bg-white px-4 py-3 border-b border-gray-100 space-y-3">
      <UInput
        v-model="searchQuery"
        placeholder="Поиск лекарств или аптек..."
        size="lg"
        class="w-full"
      >
        <template #leading>
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
        </template>
      </UInput>

      <div class="flex items-center space-x-3 overflow-x-auto">
        <UButton
          :variant="showNearbyOnly ? 'solid' : 'outline'"
          :color="showNearbyOnly ? 'blue' : 'gray'"
          size="sm"
          @click="showNearbyOnly = !showNearbyOnly"
        >
          <Icon name="heroicons:map-pin" class="w-4 h-4 mr-1" />
          Рядом
        </UButton>
        
        <UButton
          :variant="showOpenOnly ? 'solid' : 'outline'"
          :color="showOpenOnly ? 'green' : 'gray'"
          size="sm"
          @click="showOpenOnly = !showOpenOnly"
        >
          <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
          Открыто
        </UButton>
        
        <UButton
          :variant="showDeliveryOnly ? 'solid' : 'outline'"
          :color="showDeliveryOnly ? 'purple' : 'gray'"
          size="sm"
          @click="showDeliveryOnly = !showDeliveryOnly"
        >
          <Icon name="heroicons:truck" class="w-4 h-4 mr-1" />
          Доставка
        </UButton>
      </div>
    </div>

    <!-- Переключатель вида -->
    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          :class="viewMode === 'pharmacies' 
            ? 'bg-white text-medical-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'"
          @click="viewMode = 'pharmacies'"
        >
          Аптеки
        </button>
        <button
          class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          :class="viewMode === 'medicines' 
            ? 'bg-white text-medical-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'"
          @click="viewMode = 'medicines'"
        >
          Лекарства
        </button>
      </div>
    </div>

    <!-- Список аптек -->
    <div v-if="viewMode === 'pharmacies'" class="px-4 py-4 space-y-4">
      <div
        v-for="pharmacy in filteredPharmacies"
        :key="pharmacy.id"
        class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        @click="selectPharmacy(pharmacy)"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h3 class="font-semibold text-gray-900">{{ pharmacy.name }}</h3>
              <UBadge
                :label="pharmacy.isOpen ? 'Открыто' : 'Закрыто'"
                :color="pharmacy.isOpen ? 'green' : 'red'"
                size="sm"
              />
            </div>
            
            <p class="text-sm text-gray-600 mb-2">{{ pharmacy.address }}</p>
            
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:map-pin" class="w-4 h-4" />
                <span>{{ pharmacy.distance }} км</span>
              </div>
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:clock" class="w-4 h-4" />
                <span>{{ pharmacy.openHours }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 fill-current" />
                <span>{{ pharmacy.rating }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-end space-y-2">
            <UButton
              icon="heroicons:phone"
              variant="outline"
              size="sm"
              @click.stop="callPharmacy(pharmacy)"
            />
            <div v-if="pharmacy.deliveryAvailable" class="flex items-center text-purple-600">
              <Icon name="heroicons:truck" class="w-4 h-4 mr-1" />
              <span class="text-xs">Доставка</span>
            </div>
          </div>
        </div>
        
        <!-- Быстрые действия -->
        <div class="flex space-x-2">
          <UButton
            variant="outline"
            size="sm"
            @click.stop="showOnMap(pharmacy)"
          >
            На карте
          </UButton>
          <UButton
            variant="outline"
            size="sm"
            @click.stop="showMedicines(pharmacy)"
          >
            Каталог
          </UButton>
          <UButton
            v-if="pharmacy.deliveryAvailable"
            color="purple"
            size="sm"
            @click.stop="orderDelivery(pharmacy)"
          >
            Заказать
          </UButton>
        </div>
      </div>
    </div>

    <!-- Каталог лекарств -->
    <div v-else class="px-4 py-4 space-y-4">
      <!-- Категории лекарств -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h3 class="font-semibold text-gray-900 mb-3">Категории</h3>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="category in medicineCategories"
            :key="category.name"
            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            @click="selectCategory(category)"
          >
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="category.bgColor">
              <span class="text-xl">{{ category.emoji }}</span>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ category.name }}</p>
              <p class="text-xs text-gray-500">{{ category.count }} товаров</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Список лекарств -->
      <div
        v-for="medicine in filteredMedicines"
        :key="medicine.id"
        class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
      >
        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:cube" class="w-8 h-8 text-gray-400" />
          </div>
          
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-semibold text-gray-900">{{ medicine.name }}</h3>
                <p class="text-sm text-gray-600">{{ medicine.manufacturer }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ medicine.description }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">{{ medicine.price }}₽</p>
                <UBadge
                  :label="medicine.inStock ? 'В наличии' : 'Нет в наличии'"
                  :color="medicine.inStock ? 'green' : 'red'"
                  size="sm"
                />
              </div>
            </div>
            
            <div v-if="medicine.requiresPrescription" class="mb-3">
              <UBadge
                label="По рецепту"
                color="orange"
                size="sm"
              />
            </div>
            
            <div class="flex space-x-2">
              <UButton
                variant="outline"
                size="sm"
                @click="viewMedicine(medicine)"
              >
                Подробнее
              </UButton>
              <UButton
                color="blue"
                size="sm"
                :disabled="!medicine.inStock"
                @click="addToCart(medicine)"
              >
                В корзину
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Корзина (плавающая кнопка) -->
    <div v-if="cartItems.length > 0" class="fixed bottom-20 right-4 z-50">
      <UButton
        color="blue"
        size="lg"
        class="rounded-full shadow-lg"
        @click="openCart"
      >
        <Icon name="heroicons:shopping-bag" class="w-6 h-6 mr-2" />
        {{ cartItems.length }}
      </UButton>
    </div>

    <!-- Модальное окно корзины -->
    <UModal v-model="isCartOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Корзина</h3>
        
        <div class="space-y-3 mb-6">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-600">{{ item.price }}₽</p>
            </div>
            <div class="flex items-center space-x-2">
              <UButton
                icon="heroicons:minus"
                variant="outline"
                size="sm"
                @click="updateQuantity(item.id, item.quantity - 1)"
              />
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <UButton
                icon="heroicons:plus"
                variant="outline"
                size="sm"
                @click="updateQuantity(item.id, item.quantity + 1)"
              />
            </div>
          </div>
        </div>
        
        <div class="border-t pt-4 mb-6">
          <div class="flex justify-between items-center text-lg font-semibold">
            <span>Итого:</span>
            <span>{{ totalPrice }}₽</span>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <UButton
            variant="outline"
            class="flex-1"
            @click="isCartOpen = false"
          >
            Продолжить покупки
          </UButton>
          <UButton
            color="blue"
            class="flex-1"
            @click="checkout"
          >
            Оформить заказ
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Pharmacy, Medicine } from '~/types'

definePageMeta({
  title: 'Аптеки'
})

const router = useRouter()
const toast = useToast()

const searchQuery = ref('')
const viewMode = ref<'pharmacies' | 'medicines'>('pharmacies')
const showNearbyOnly = ref(false)
const showOpenOnly = ref(false)
const showDeliveryOnly = ref(false)
const isCartOpen = ref(false)

// Данные аптек
const allPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Аптека №1',
    address: 'ул. Ленина, 15',
    distance: 0.5,
    rating: 4.8,
    isOpen: true,
    openHours: '8:00 - 22:00',
    phone: '+7 (999) 123-45-67',
    deliveryAvailable: true
  },
  {
    id: '2',
    name: 'Фармация',
    address: 'пр. Мира, 42',
    distance: 1.2,
    rating: 4.6,
    isOpen: true,
    openHours: '9:00 - 21:00',
    phone: '+7 (999) 765-43-21',
    deliveryAvailable: false
  },
  {
    id: '3',
    name: 'Здоровье',
    address: 'ул. Гагарина, 8',
    distance: 2.1,
    rating: 4.9,
    isOpen: false,
    openHours: '8:00 - 20:00',
    phone: '+7 (999) 555-55-55',
    deliveryAvailable: true
  }
]

// Категории лекарств
const medicineCategories = [
  { name: 'Болеутоляющие', emoji: '💊', bgColor: 'bg-red-100', count: 45 },
  { name: 'Витамины', emoji: '🟡', bgColor: 'bg-yellow-100', count: 67 },
  { name: 'Антибиотики', emoji: '🔴', bgColor: 'bg-blue-100', count: 23 },
  { name: 'Сердечные', emoji: '❤️', bgColor: 'bg-pink-100', count: 34 },
  { name: 'Простуда', emoji: '🤧', bgColor: 'bg-green-100', count: 56 },
  { name: 'Пищеварение', emoji: '🟢', bgColor: 'bg-purple-100', count: 29 }
]

// Данные лекарств
const allMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Парацетамол 500мг',
    description: 'Жаропонижающее и болеутоляющее средство',
    price: 89,
    manufacturer: 'Фармстандарт',
    category: 'Болеутоляющие',
    inStock: true,
    requiresPrescription: false
  },
  {
    id: '2',
    name: 'Аспирин Кардио 100мг',
    description: 'Для профилактики сердечно-сосудистых заболеваний',
    price: 156,
    manufacturer: 'Bayer',
    category: 'Сердечные',
    inStock: true,
    requiresPrescription: true
  },
  {
    id: '3',
    name: 'Витамин D3 2000МЕ',
    description: 'Поддержка иммунитета и костной системы',
    price: 445,
    manufacturer: 'Solgar',
    category: 'Витамины',
    inStock: false,
    requiresPrescription: false
  }
]

// Корзина
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const cartItems = ref<CartItem[]>([])

const filteredPharmacies = computed(() => {
  let result = [...allPharmacies]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(pharmacy => 
      pharmacy.name.toLowerCase().includes(query) ||
      pharmacy.address.toLowerCase().includes(query)
    )
  }
  
  if (showNearbyOnly.value) {
    result = result.filter(pharmacy => pharmacy.distance <= 1)
  }
  
  if (showOpenOnly.value) {
    result = result.filter(pharmacy => pharmacy.isOpen)
  }
  
  if (showDeliveryOnly.value) {
    result = result.filter(pharmacy => pharmacy.deliveryAvailable)
  }
  
  return result.sort((a, b) => a.distance - b.distance)
})

const filteredMedicines = computed(() => {
  let result = [...allMedicines]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(medicine => 
      medicine.name.toLowerCase().includes(query) ||
      medicine.description.toLowerCase().includes(query) ||
      medicine.manufacturer.toLowerCase().includes(query)
    )
  }
  
  return result
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const selectPharmacy = (pharmacy: Pharmacy) => {
  router.push(`/pharmacies/${pharmacy.id}`)
}

const callPharmacy = (pharmacy: Pharmacy) => {
  if (process.client) {
    window.open(`tel:${pharmacy.phone}`, '_self')
  }
}

const showOnMap = (pharmacy: Pharmacy) => {
  toast.add({
    title: 'В разработке',
    description: 'Функция карты скоро будет доступна',
    color: 'yellow'
  })
}

const showMedicines = (pharmacy: Pharmacy) => {
  viewMode.value = 'medicines'
}

const orderDelivery = (pharmacy: Pharmacy) => {
  toast.add({
    title: 'Доставка',
    description: `Доставка из ${pharmacy.name} - 30-60 минут`,
    color: 'blue'
  })
}

const selectCategory = (category: any) => {
  searchQuery.value = category.name
}

const viewMedicine = (medicine: Medicine) => {
  router.push(`/medicines/${medicine.id}`)
}

const addToCart = (medicine: Medicine) => {
  const existingItem = cartItems.value.find(item => item.id === medicine.id)
  
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1
    })
  }
  
  toast.add({
    title: 'Добавлено в корзину',
    description: medicine.name,
    color: 'green'
  })
}

const updateQuantity = (itemId: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  } else {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      item.quantity = newQuantity
    }
  }
}

const openCart = () => {
  isCartOpen.value = true
}

const checkout = () => {
  isCartOpen.value = false
  router.push('/checkout')
}
</script>
