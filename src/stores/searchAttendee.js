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

  function getCurrentISO8601DateTime() {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const second = String(now.getSeconds()).padStart(2, '0')
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

    const timezoneOffset = -now.getTimezoneOffset()
    const timezoneOffsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0')
    const timezoneOffsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')
    const timezoneOffsetSign = timezoneOffset >= 0 ? '+' : '-'

    const iso8601DateTime = `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}${timezoneOffsetSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`

    return iso8601DateTime
  }

  async function checkInAttendee(id) {
    var attendeeRes = null
    await useApiStore()
      .get(true, `attendees/${id}`)
      .then((res) => (attendeeRes = res.data.attributes))

    const payload = {
      data: {
        attributes: {
          'is-checked-in': 'true',
          'checkin-times': getCurrentISO8601DateTime(),
          'attendee-notes': null,
          pdf_url: attendeeRes['pdf-url']
        },
        type: 'attendee',
        id: `${id}`
      }
    }
    await useApiStore()
      .patch(`attendees/${id}`, payload)
      .then((res) => console.log(res.data.attributes))
  }

  return { people, filterOptions, getAttendee, clearAttendees, checkInAttendee }
})
