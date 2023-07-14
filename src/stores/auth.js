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
        .post(true, route)
        .then(() => {
          logoutClear()
          return true
        })
    } catch (error) {
      return false
    }
  }

  async function login(payload, route) {
    try {
      const res = await useApiStore().post(true, route, payload, false)
      return Object(res)
    } catch (error) {
      return error
    }
  }

  return { logout, login }
})
