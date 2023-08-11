import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const list = ref([])

  function addNotification(messages, type) {
    list.value.push({ messages: messages, type: type })
  }
  return { list, addNotification }
})
