import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useSearchAttendeeStore = defineStore('searchAttendee', () => {
  const people = ref([])

  const ticketTypes = ref([])

  const filterOptions = ref([
    // default filter option
    {
      id: 0,
      name: 'Ticket Type',
      ticket: null,
      show: ref(false)
    },
  ])

  async function getAttendee(value, eventId) {
    try {
      const searchedAttendees = await fetchAttendees(`name=${value}&email=`, eventId)
      if (searchedAttendees.length === 0) throw new Error('No search results')
      people.value = searchedAttendees
    } catch {
      const searchedAttendees = await fetchAttendees(`name=&email=${value}`, eventId)
      people.value = searchedAttendees
    }
    //console.log(people.value)
  }

  async function fetchAttendees(path, eventId) {
    const attendees = await useApiStore().get(true, `events/${eventId}/attendees/search?${path}`)
    return attendees.attendees.map((attendee) => ({
      id: attendee.id,
      name: attendee.firstname + ' ' + attendee.lastname,
      email: attendee.email,
      ticketId: attendee.ticket_id,
      checkedIn: ref(attendee.is_registered),
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
      if (errors.find((error) => error.detail === 'Attendee already registered.')) {
        throw new Error('Already checked in')
      }
    }
  }

  async function getTicketDetails(eventId) {
    try {
      const ticketsDetails = await useApiStore().get(true, `events/${eventId}/tickets`)
      const tickets = ticketsDetails.data.map((ticket) => {
        return {
          id: ticket.id,
          type: ticket.type,
          name: ticket.attributes.name
        }
      })
      ticketTypes.value = tickets
      // set filter options based on badge fields of all ticket types
      tickets.forEach((ticket) => {
        useApiStore().get(true, `tickets/${ticket.id}/badge-forms`)
          .then((res) => {
            res.filter((field) => field.field_identifier !== 'QR' && field.field_identifier !== 'email') // remove QR code and email
              .forEach((option) => {
                filterOptions.value.push({
                  id: option.field_identifier,
                  name: option.custom_field,
                  ticket: ticket.name,
                  show: ref(false)
                })
            })
          })
          //console.log(filterOptions.value)
      })

    } catch (error) {
      console.error(error)
    }
  }

  return { people, filterOptions, getAttendee, clearAttendees, checkInAttendee, getTicketDetails }
})
