import { defineStore } from 'pinia'

export const useApiConfigStore = defineStore('apiConfig', {
  state: () => ({
    config: {
      doubaoApiKey: '',
      deepseekApiKey: '',
      tongyiApiKey: '',
      chatgptApiKey: ''
    }
  }),

  actions: {
    loadConfig() {
      try {
        const savedConfig = localStorage.getItem('apiConfig')
        if (savedConfig) {
          this.config = JSON.parse(savedConfig)
        }
      } catch (error) {
        console.error('Failed to load API config:', error)
      }
    },

    saveConfig() {
      try {
        localStorage.setItem('apiConfig', JSON.stringify(this.config))
      } catch (error) {
        console.error('Failed to save API config:', error)
      }
    },

    clearConfig() {
      try {
        this.config = {
          doubaoApiKey: '',
          deepseekApiKey: '',
          tongyiApiKey: '',
          chatgptApiKey: ''
        }
        localStorage.removeItem('apiConfig')
      } catch (error) {
        console.error('Failed to clear API config:', error)
      }
    }
  }
})