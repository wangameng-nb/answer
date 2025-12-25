<script setup>
import { ref, onMounted } from 'vue'
import { useApiConfigStore } from '../stores/apiConfigStore'

const store = useApiConfigStore()
const emit = defineEmits(['close'])
const saving = ref(false)
const saveSuccess = ref(false)

onMounted(() => {
  store.loadConfig()
})

const handleSave = () => {
  saving.value = true
  store.saveConfig()
  
  setTimeout(() => {
    saving.value = false
    saveSuccess.value = true
    
    setTimeout(() => {
      saveSuccess.value = false
    }, 2000)
  }, 500)
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">API配置</h2>
        <button 
          @click="emit('close')" 
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">豆包API密钥</label>
            <div class="flex gap-2">
              <input 
                v-model="store.config.doubaoApiKey" 
                type="password" 
                placeholder="输入豆包API密钥" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">DeepSeek API密钥</label>
            <div class="flex gap-2">
              <input 
                v-model="store.config.deepseekApiKey" 
                type="password" 
                placeholder="输入DeepSeek API密钥" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">通义千问API密钥</label>
            <div class="flex gap-2">
              <input 
                v-model="store.config.tongyiApiKey" 
                type="password" 
                placeholder="输入通义千问API密钥" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ChatGPT API密钥</label>
            <div class="flex gap-2">
              <input 
                v-model="store.config.chatgptApiKey" 
                type="password" 
                placeholder="输入ChatGPT API密钥" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p class="text-sm text-blue-700">
              <strong>注意：</strong>API密钥将存储在您的浏览器本地存储中，不会上传到服务器。
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex justify-end items-center p-6 border-t gap-3">
        <button 
          @click="emit('close')" 
          class="btn-secondary"
        >
          取消
        </button>
        <button 
          @click="handleSave" 
          :disabled="saving"
          class="btn-primary flex items-center"
        >
          <div v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          保存配置
        </button>
      </div>
      
      <!-- Save Success Indicator -->
      <div 
        v-if="saveSuccess" 
        class="fixed bottom-8 right-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50"
      >
        配置已保存
      </div>
    </div>
  </div>
</template>