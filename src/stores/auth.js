import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useAuthStore = defineStore('auth', () => {
  // clear tokens
  function logoutClear() {
    localStorage.clear()
    useApiStore().clearToken()
  }

  async function logout(route) {
    try {
      await useApiStore()
        .post(false, route)
        .then(() => {
          logoutClear()
          return true
        })
    } catch (error) {
      return false
    }
  }

  return { logout }
})
