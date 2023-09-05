import { useApiStore } from '@/stores/api'
import { useSessionsStore } from '@/stores/sessions'
import { useStationsStore } from '@/stores/stations'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAttendeesStore = defineStore('attendees', () => {
  const apiStore = useApiStore()
  const stations = useStationsStore()
  const sessions = useSessionsStore()

  const attendees = ref([])

  function $reset() {
    attendees.value = []
  }

  async function fetchAttendees(eventId, fieldType, value) {
    let route = `events/${eventId}/attendees/search?`
    if (fieldType === 'name') {
      route += `name=${value}`
    }

    if (fieldType === 'email') {
      route += `email=${value}`
    }
    try {
      const res = await apiStore.get(true, `events/${eventId}/attendees/search?${route}`)
      attendees.value = res.attendees.map((attendee) => ({
        id: attendee.id,
        name: attendee.firstname + ' ' + attendee.lastname,
        email: attendee.email,
        ticketId: attendee.ticket_id,
        checkedIn: ref(attendee.is_registered),
        info: {
          attendee
        }
      }))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function registerAttendee(attendeeId, stationId) {
    const payload = {
      data: {
        relationships: {
          station: {
            data: {
              type: 'station',
              id: String(stationId)
            }
          },
          ticket_holder: {
            data: {
              type: 'attendee',
              id: String(attendeeId)
            }
          }
        },
        type: 'user_check_in'
      }
    }
    try {
      const res = await apiStore.post(true, 'user-check-in', payload, false)
      return res.data.attributes.success
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function checkInAttendee(attendeeId, microlocationId) {
    try {
      const stationId = await stations.getStationIdWithMicrolocation(microlocationId)
      const session = await sessions.getCurrentSession(microlocationId)
      const sessionId = session ? String(session.id) : null
      const payload = {
        data: {
          relationships: {
            station: {
              data: {
                type: 'station',
                id: String(stationId)
              }
            },
            // session is optional if is daily check in
            session: {
              data: {
                type: 'session',
                id: sessionId
              }
            },
            ticket_holder: {
              data: {
                type: 'attendee',
                id: String(attendeeId)
              }
            }
          },
          type: 'user_check_in'
        }
      }
      return await apiStore.post(true, 'user-check-in', payload, false)
    } catch (error) {
      return Promise.reject('Error checking in.')
    }
  }

  async function getAttendeeName(attendeeId) {
    try {
      const attendee = await apiStore.get(true, `attendees/${attendeeId}`)
      return attendee.data.attributes['firstname'] + ' ' + attendee.data.attributes['lastname']
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    attendees,
    $reset,
    fetchAttendees,
    registerAttendee,
    checkInAttendee,
    getAttendeeName
  }
})
