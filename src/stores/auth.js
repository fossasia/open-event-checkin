import { defineStore } from 'pinia'
import { useApi } from '@/stores/api'

export const useAuthStore = defineStore('auth', () => {
  // clear tokens
  function logoutClear() {
    localStorage.clear()
    useApi().clearToken()
  }

  async function logout(route) {
    try {
      await useApi()
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
      const res = await useApi().post(true, route, payload, false)
      return Object(res)
    } catch (error) {
      return error
    }
  }

  return { logout, login }
})
