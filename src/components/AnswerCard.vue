<script setup>
import { ref } from 'vue'

const props = defineProps({
  provider: {
    type: String,
    required: true
  },
  answer: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['regenerate'])
const copySuccess = ref(false)

const providerConfig = {
  'doubao': { name: '豆包', color: 'bg-blue-500' },
  'deepseek': { name: 'DeepSeek', color: 'bg-green-500' },
  'tongyi': { name: '通义千问', color: 'bg-purple-500' },
  'chatgpt': { name: 'ChatGPT', color: 'bg-orange-500' }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'waiting':
      return '等待中'
    case 'processing':
      return '处理中'
    case 'completed':
      return '已完成'
    case 'error':
      return '错误'
    default:
      return '未知状态'
  }
}

const copyToClipboard = async () => {
  if (props.answer.content) {
    try {
      await navigator.clipboard.writeText(props.answer.content)
      copySuccess.value = true
      setTimeout(() => {
        copySuccess.value = false
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<template>
  <div class="card h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2" :class="providerConfig[provider]?.color || 'bg-gray-500'"></div>
        <h3 class="font-semibold text-gray-800">{{ providerConfig[provider]?.name || provider }}</h3>
      </div>
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="getStatusColor(answer.status)"
      >
        {{ getStatusText(answer.status) }}
      </span>
    </div>
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto mb-4">
      <div v-if="answer.status === 'waiting'" class="text-center py-8 text-gray-400">
        等待生成...
      </div>
      
      <div v-else-if="answer.status === 'processing'" class="text-center py-8">
        <div class="loading mx-auto mb-2"></div>
        <div class="text-gray-500">正在生成答案...</div>
      </div>
      
      <div v-else-if="answer.status === 'error'" class="text-center py-8 text-red-500">
        <p>{{ answer.error || '生成失败，请检查API配置' }}</p>
        <button 
          @click="emit('regenerate', provider)" 
          class="mt-2 text-sm text-primary-600 hover:underline"
        >
          重试
        </button>
      </div>
      
      <div v-else class="prose max-w-none text-gray-700">
        <p>{{ answer.content || '无内容' }}</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="flex justify-between items-center pt-3 border-t border-gray-100">
      <div class="text-xs text-gray-500">
        {{ formatTime(answer.timestamp) }}
      </div>
      <button 
        @click="copyToClipboard" 
        :disabled="!answer.content"
        class="btn-secondary text-xs px-3 py-1"
      >
        {{ copySuccess ? '已复制' : '复制' }}
      </button>
    </div>
  </div>
</template>