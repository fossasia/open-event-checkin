import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import { useEventsStore } from '@/stores/events'

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

  async function getAttendee(name, email) {

    const searchedAttendees = []
    const eventId = useEventsStore().getEventId()
    const attendees = await useApiStore().get(
      true,
      `events/${eventId}/attendees/search?name=${name}&email=${email}`
    )
    for (const attendee of attendees.attendees) {
      searchedAttendees.push({
        id: attendee.id,
        name: attendee.firstname + ' ' + attendee.lastname,
        email: attendee.email,
        checkedIn: ref(attendee.is_checked_in),
        info: {
          role: null,
          memberType: null,
          organisation: attendee.company
        }
      })
    }
    people.value = searchedAttendees
  }

  function clearAttendees() {
    people.value = []
  }

  return { people, filterOptions, getAttendee, clearAttendees }
})
