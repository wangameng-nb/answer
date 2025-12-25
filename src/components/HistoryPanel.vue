<script setup>
import { ref, onMounted } from 'vue'
import { useHistoryStore } from '../stores/historyStore'

const store = useHistoryStore()
const emit = defineEmits(['close', 'select'])
const searchQuery = ref('')

onMounted(() => {
  store.loadHistory()
})

const filteredHistory = store.history.filter(item => 
  item.question.toLowerCase().includes(searchQuery.value.toLowerCase())
)

const handleSelect = (item) => {
  emit('select', item.question)
  emit('close')
}

const handleDelete = (id) => {
  store.deleteHistoryItem(id)
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">历史记录</h2>
        <button 
          @click="emit('close')" 
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Search -->
      <div class="p-6 border-b">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索历史记录..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
        >
      </div>
      
      <!-- History List -->
      <div class="p-6">
        <div v-if="filteredHistory.length === 0" class="text-center py-12 text-gray-500">
          <p v-if="searchQuery">没有找到匹配的历史记录</p>
          <p v-else>暂无历史记录</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="item in filteredHistory" 
            :key="item.id"
            class="card hover:shadow-lg transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1 mr-4">
                <p class="text-sm text-gray-500 mb-2">{{ formatDate(item.timestamp) }}</p>
                <p class="text-gray-800 font-medium mb-2 truncate">
                  {{ item.question }}
                </p>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="(answer, provider) in item.answers" 
                    :key="provider"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {{ provider }}
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-2 items-end">
                <button 
                  @click="handleSelect(item)" 
                  class="text-sm text-primary-600 hover:underline"
                >
                  查看
                </button>
                <button 
                  @click="handleDelete(item.id)" 
                  class="text-sm text-red-600 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>