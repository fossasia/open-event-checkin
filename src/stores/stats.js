import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'

export const useStatsStore = defineStore('stats', () => {
  const apiStore = useApiStore()

  async function getStats(eventId, sessionId) {
    const sessionIds = sessionId ? `?session_ids=${sessionId}` : ''
    try {
      const res = await apiStore.get(true, `user-check-in/stats/event/${eventId}${sessionIds}`)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { getStats }
})
