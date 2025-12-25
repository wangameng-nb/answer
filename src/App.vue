<script setup>
import { ref } from 'vue'
import QuestionInput from './components/QuestionInput.vue'
import AnswerDisplay from './components/AnswerDisplay.vue'
import ApiConfig from './components/ApiConfig.vue'
import HistoryPanel from './components/HistoryPanel.vue'

const question = ref('')
const showConfig = ref(false)
const showHistory = ref(false)

const handleSubmit = (q) => {
  question.value = q
}

const handleClear = () => {
  question.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">生物竞赛答案对比平台</h1>
            <p class="text-gray-600 mt-1">同时获取多个AI的答案，轻松对比选择</p>
          </div>
          <div class="flex gap-3 mt-4 md:mt-0">
            <button 
              @click="showConfig = !showConfig" 
              class="btn-secondary"
            >
              API配置
            </button>
            <button 
              @click="showHistory = !showHistory" 
              class="btn-secondary"
            >
              历史记录
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- API Config Panel -->
      <ApiConfig v-if="showConfig" @close="showConfig = false" />
      
      <!-- History Panel -->
      <HistoryPanel v-if="showHistory" @close="showHistory = false" @select="handleSubmit" />
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Question Input Section -->
        <div class="md:col-span-1">
          <QuestionInput 
            @submit="handleSubmit" 
            @clear="handleClear"
          />
        </div>

        <!-- Answer Display Section -->
        <div class="md:col-span-2">
          <AnswerDisplay :question="question" />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white shadow-inner mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>生物竞赛答案对比平台 © 2024</p>
        <p class="text-sm mt-1">仅供学习和参考使用</p>
      </div>
    </footer>
  </div>
</template>