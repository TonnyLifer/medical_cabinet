<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
    <!-- Заголовок -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Корзина</h1>
      
      <!-- Товары в корзине -->
      <div v-if="cartItems.length > 0" class="space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:beaker" class="w-8 h-8 text-blue-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
              <p class="text-sm text-gray-600">{{ item.description }}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-lg font-bold text-blue-600">{{ item.price }}₽</span>
                <div class="flex items-center space-x-3">
                  <button 
                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    @click="decreaseQuantity(item.id)"
                  >
                    <Icon name="heroicons:minus" class="w-4 h-4 text-gray-600" />
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button 
                    class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    @click="increaseQuantity(item.id)"
                  >
                    <Icon name="heroicons:plus" class="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Итого -->
        <div class="bg-white rounded-2xl p-4 shadow-sm mt-6">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold text-gray-900">Итого:</span>
            <span class="text-xl font-bold text-blue-600">{{ totalPrice }}₽</span>
          </div>
          <UButton
            class="w-full"
            size="lg"
            @click="checkout"
          >
            Оформить заказ
          </UButton>
        </div>
      </div>
      
      <!-- Пустая корзина -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Icon name="heroicons:shopping-bag" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Корзина пуста</h3>
        <p class="text-gray-600 mb-6">Добавьте лекарства или товары для здоровья</p>
        <UButton
          @click="$router.push('/pharmacies')"
        >
          Перейти в аптеки
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Корзина'
})

const toast = useToast()

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
}

// Заглушка товаров в корзине
const cartItems = ref<CartItem[]>([
  {
    id: '1',
    name: 'Парацетамол',
    description: 'Жаропонижающее средство 500мг №20',
    price: 89,
    quantity: 2
  },
  {
    id: '2',
    name: 'Витамин D3',
    description: 'Витамины для укрепления иммунитета',
    price: 450,
    quantity: 1
  }
])

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const increaseQuantity = (itemId: string) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.quantity++
  }
}

const decreaseQuantity = (itemId: string) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) {
    item.quantity--
  } else if (item && item.quantity === 1) {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    toast.add({
      title: 'Товар удален',
      description: 'Товар удален из корзины',
      color: 'yellow'
    })
  }
}

const checkout = () => {
  toast.add({
    title: 'Заказ оформлен!',
    description: 'Ваш заказ принят в обработку',
    color: 'green'
  })
  
  // Очищаем корзину после оформления
  setTimeout(() => {
    cartItems.value = []
  }, 2000)
}
</script>
