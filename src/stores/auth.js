import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useAuthStore = defineStore('auth', () => {
  async function logout() {
    try {
      const res = await useApiStore().post(false, 'auth/logout')
      localStorage.clear()
      useApiStore().clearToken()
      console.log('logout success')
      return res.success
    } catch (error) {
      console.log('logout failed')
      return await Promise.reject(error)
    }
  }

  async function verifyPassword(payload, route) {
    try {
      const res = await useApiStore().post(true, route, payload, false)
      return res.result
    } catch (error) {
      return await Promise.reject(error)
    }
  }

  return { logout, verifyPassword }
})
