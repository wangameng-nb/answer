import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: []
  }),

  actions: {
    loadHistory() {
      try {
        const savedHistory = localStorage.getItem('history')
        if (savedHistory) {
          this.history = JSON.parse(savedHistory)
        }
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    },

    saveHistory() {
      try {
        localStorage.setItem('history', JSON.stringify(this.history))
      } catch (error) {
        console.error('Failed to save history:', error)
      }
    },

    addHistoryItem(item) {
      // 限制历史记录数量为50条
      if (this.history.length >= 50) {
        this.history.shift() // 移除最旧的记录
      }
      
      this.history.unshift(item) // 添加到最前面
      this.saveHistory()
    },

    deleteHistoryItem(id) {
      this.history = this.history.filter(item => item.id !== id)
      this.saveHistory()
    },

    clearHistory() {
      this.history = []
      this.saveHistory()
    }
  }
})