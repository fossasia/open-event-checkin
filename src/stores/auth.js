import { useApiStore } from '@/stores/api'
import clearStores from '@/utils/clearStores'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const apiStore = useApiStore()

  async function logout() {
    try {
      const res = await apiStore.post(false, 'auth/logout')
      useApiStore().clearToken()
      localStorage.clear()
      // clear all stores as well
      clearStores()
      return res.success
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function login(payload) {
    try {
      const res = await apiStore.post(true, 'auth/login', payload)
      localStorage.setItem('token', res.access_token)
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function verifyPassword(payload) {
    try {
      const res = await apiStore.post(true, 'auth/verify-password', payload)
      return res.result
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { logout, login, verifyPassword }
})
