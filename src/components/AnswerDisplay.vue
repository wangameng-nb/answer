<script setup>
import { ref, watch } from 'vue'
import { useAnswerStore } from '../stores/answerStore'
import AnswerCard from './AnswerCard.vue'

const props = defineProps({
  question: {
    type: String,
    default: ''
  }
})

const store = useAnswerStore()
const isLoading = ref(false)

// 监听问题变化，调用AI生成答案
watch(() => props.question, (newQuestion) => {
  if (newQuestion) {
    generateAnswers(newQuestion)
  }
})

const generateAnswers = async (question) => {
  isLoading.value = true
  await store.generateAllAnswers(question)
  isLoading.value = false
}

const handleRegenerate = (provider) => {
  if (props.question) {
    store.generateSingleAnswer(provider, props.question)
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">答案对比</h2>
      <div v-if="isLoading" class="flex items-center text-sm text-primary-600">
        <div class="loading mr-2"></div>
        <span>正在生成答案...</span>
      </div>
    </div>
    
    <div v-if="!question" class="text-center py-12 text-gray-500">
      <p>请在左侧输入题目，点击"生成答案"按钮获取结果</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnswerCard 
        v-for="(answer, provider) in store.answers" 
        :key="provider"
        :provider="provider"
        :answer="answer"
        @regenerate="handleRegenerate"
      />
    </div>
  </div>
</template>