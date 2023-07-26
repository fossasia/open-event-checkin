import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePasswordModalStore = defineStore('passwordModal', () => {
  const password = ref('1234')

  return { password }
})
