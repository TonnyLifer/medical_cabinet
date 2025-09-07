<template>
  <UModal v-model="isOpen" :ui="{ container: 'fixed inset-0 z-50 flex items-start justify-center pt-16 px-4', backdrop: 'bg-gray-100/80' }">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
      <div class="p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Поиск</h3>
          <button 
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div class="relative mb-4">
           <input
             v-model="searchQuery"
             placeholder="Найти врача, специальность..."
             size="lg"
             autofocus
             class="w-full bg-white border border-gray-200 rounded-xl px-2 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
           />
        </div>
        
        <!-- Результаты поиска -->
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
            @click="selectResult(result)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon :name="result.icon" class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ result.title }}</p>
                <p class="text-sm text-gray-500">{{ result.description }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="searchResults.length === 0 && searchQuery" class="text-center py-8">
            <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500">Ничего не найдено</p>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
interface SearchResult {
  id: number
  title: string
  description: string
  icon: string
}

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', result: SearchResult): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const searchQuery = ref('')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const results: SearchResult[] = [
    {
      id: 1,
      title: 'Кардиолог',
      description: 'Специалисты по сердечно-сосудистым заболеваниям',
      icon: 'heroicons:heart'
    },
    {
      id: 2,
      title: 'Терапевт',
      description: 'Врачи общей практики',
      icon: 'heroicons:user'
    },
    {
      id: 3,
      title: 'Невролог',
      description: 'Специалисты по нервной системе',
      icon: 'heroicons:brain'
    },
    {
      id: 4,
      title: 'Стоматолог',
      description: 'Специалисты по лечению зубов',
      icon: 'heroicons:tooth'
    },
    {
      id: 5,
      title: 'Дерматолог',
      description: 'Специалисты по кожным заболеваниям',
      icon: 'heroicons:face-smile'
    }
  ]
  
  return results.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const closeModal = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const selectResult = (result: SearchResult) => {
  emit('select', result)
  closeModal()
}
</script>
