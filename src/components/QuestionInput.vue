<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'clear'])
const question = ref('')

const handleSubmit = () => {
  if (question.value.trim()) {
    emit('submit', question.value.trim())
  }
}

const handleClear = () => {
  question.value = ''
  emit('clear')
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    handleSubmit()
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">题目输入</h2>
      <div class="text-sm text-gray-500">Ctrl+Enter 快速提交</div>
    </div>
    
    <textarea
      v-model="question"
      placeholder="请输入生物竞赛题目..."
      class="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
      @keydown="handleKeyPress"
    ></textarea>
    
    <div class="flex gap-3 mt-4">
      <button 
        @click="handleSubmit" 
        class="btn-primary flex-1"
      >
        生成答案
      </button>
      <button 
        @click="handleClear" 
        class="btn-secondary"
      >
        清空
      </button>
    </div>
  </div>
</template>