import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const list = ref([])

  function addNotification(messages, type) {
    list.value.push({ messages: messages, type: type })
  }
  return { list, addNotification }
})
