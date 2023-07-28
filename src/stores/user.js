import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  async function storeDetails(payload) {
    const attributes = payload.data.attributes

    const userDetails = {
      user_id: payload.data.id,
      public_name: attributes['public-name'],
      first_name: attributes['first-name'],
      last_name: attributes['last-name'],
      email: attributes['email']
    }
    localStorage.setItem('user_details', JSON.stringify(userDetails))
  }

  return { storeDetails }
})
