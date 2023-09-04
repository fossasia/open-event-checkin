import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  async function getUserId() {
    try {
      const res = await useApiStore().get(true, `users/user-details/get-user-id`)
      return res.user_id
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getUserDetails(userId) {
    try {
      const res = await useApiStore().get(true, `users/${userId}`)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { getUserId, getUserDetails }
})
