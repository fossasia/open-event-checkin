import { useApiStore } from '@/stores/api'
import serverDateTimeToLocal from '@/utils/serverDateTimeToLocal'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

dayjs.extend(isBetween)
export const useSessionsStore = defineStore('sessions', () => {
  const apiStore = useApiStore()
  const sessions = ref([])
  const currentSession = ref(null)

  function $reset() {
    sessions.value = []
    currentSession.value = null
  }

  async function getSessions(eventId) {
    try {
      const res = await apiStore.get(true, `events/${eventId}/sessions`)
      sessions.value = res.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getCurrentSession(microlocationId) {
    try {
      const res = await apiStore.get(true, `microlocations/${microlocationId}/sessions`)
      const session = res.data.find((session) => {
        // find session that has started but not ended
        const starts = session.attributes['starts-at']
        const ends = session.attributes['ends-at']
        return dayjs().isBetween(dayjs(starts), dayjs(ends))
      })
      currentSession.value = session
      return session
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const currentSessionName = computed(() => {
    if (currentSession.value) {
      return currentSession.value.attributes['title']
    }
    return 'No Session'
  })

  const currentSessionTimeRange = computed(() => {
    let obj = {}
    if (currentSession.value) {
      obj = {
        start: serverDateTimeToLocal(currentSession.value.attributes['starts-at']),
        end: serverDateTimeToLocal(currentSession.value.attributes['ends-at'])
      }
    }
    return obj
  })

  const formattedSessionDetails = computed(() => {
    if (currentSession.value === undefined) {
      return 'No Session'
    }

    const start = currentSessionTimeRange.value.start
    const end = currentSessionTimeRange.value.end

    const str = '(' + start + ' - ' + end + ') - ' + currentSessionName.value
    return str
  })

  return { getSessions, getCurrentSession, $reset, currentSessionName, formattedSessionDetails }
})
