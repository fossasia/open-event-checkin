import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import { useEventsStore } from '@/stores/events'
import dayjs from 'dayjs'

export const useSearchAttendeeStore = defineStore('searchAttendee', () => {
  const people = ref([])

  const filterOptions = [
    {
      id: 'filterRole',
      name: 'Role',
      show: ref(false)
    },
    {
      id: 'filterMem',
      name: 'Member type',
      show: ref(false)
    },
    {
      id: 'filterOrg',
      name: 'Organisation',
      show: ref(false)
    }
  ]

  async function getAttendee(value) {
    try {
      const searchedAttendees = await fetchAttendees(`name=${value}&email=`)
      if (searchedAttendees.length === 0) throw new Error('No search results')
      people.value = searchedAttendees
    } catch {
      const searchedAttendees = await fetchAttendees(`name=&email=${value}`)
      people.value = searchedAttendees
    }
  }

  async function fetchAttendees(path) {
    const eventId = useEventsStore().getEventId()
    const attendees = await useApiStore().get(true, `events/${eventId}/attendees/search?${path}`)
    return attendees.attendees.map((attendee) => ({
      id: attendee.id,
      name: attendee.firstname + ' ' + attendee.lastname,
      email: attendee.email,
      checkedIn: ref(attendee.is_checked_in),
      info: {
        role: null,
        memberType: null,
        organisation: attendee.company
      }
    }))
  }

  function clearAttendees() {
    people.value = []
  }

  async function checkInAttendee(id) {
    try {
      const attendee = await useApiStore().get(true, `attendees/${id}`) // to get pdf url
      const attendeeRes = attendee.data.attributes

      const payload = {
        data: {
          attributes: {
            'is-checked-in': 'true',
            'checkin-times': dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
            'attendee-notes': null,
            pdf_url: attendeeRes['pdf-url']
          },
          type: 'attendee',
          id: `${id}`
        }
      }

      const patchResponse = await useApiStore().patch(`attendees/${id}`, payload)
      console.log('check in success', patchResponse)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  return { people, filterOptions, getAttendee, clearAttendees, checkInAttendee }
})
