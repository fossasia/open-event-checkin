import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import dayjs from 'dayjs'

export const useSearchAttendeeStore = defineStore('searchAttendee', () => {
  const people = ref([])

  const filterOptions = [
    {
      id: 'organisation',
      name: 'Organisation'
    }
  ]

  async function fetchAttendees(eventId, fieldType, value) {
    let route = `events/${eventId}/attendees/search?`
    if (fieldType === 'name') {
      route += `name=${value}`
    }

    if (fieldType === 'email') {
      route += `email=${value}`
    }

    let attendees = await useApiStore().get(true, `events/${eventId}/attendees/search?${route}`)
    people.value = attendees.attendees.map((attendee) => ({
      id: attendee.id,
      name: attendee.firstname + ' ' + attendee.lastname,
      email: attendee.email,
      checkedIn: ref(attendee.is_registered),
      info: {
        organisation: attendee.company
      }
    }))
  }

  function clearAttendees() {
    people.value = []
  }

  async function checkInAttendee(attendeeId, stationId, eventId) {
    try {
      const stations = await useApiStore().get(true, `events/${eventId}/stations`)
      const station = stations.data.find((station) => station.id == stationId)
      const payload = {
        data: {
          relationships: {
            station: {
              data: {
                type: station.type,
                id: stationId + ''
              }
            },
            ticket_holder: {
              data: {
                type: 'attendee',
                id: attendeeId + ''
              }
            }
          },
          type: 'user_check_in'
        }
      }
      const checkInRes = await useApiStore().post(true, 'user-check-in', payload, false)
      console.log('register success:', attendeeId, checkInRes)
      return true
    } catch (error) {
      const errors = error.originalError.body.errors
      if (errors.find((error) => error.detail === 'Attendee already checked in.')) {
        throw new Error('Already checked in')
        return false
      }
    }
  }

  return { people, filterOptions, fetchAttendees, clearAttendees, checkInAttendee }
})
