import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTicketsStore = defineStore('tickets', () => {
  const apiStore = useApiStore()

  const filterOptions = ref([])

  function $reset() {
    filterOptions.value = []
  }

  async function getBadgeFormFields(eventId) {
    try {
      const ticketsDetails = await apiStore.get(true, `events/${eventId}/tickets`)
      const tickets = ticketsDetails.data.map((ticket) => {
        return {
          id: ticket.id,
          type: ticket.type,
          name: ticket.attributes.name
        }
      })

      // clear options
      filterOptions.value = []
      // set filter options based on badge fields of all ticket types
      tickets.forEach((ticket) => {
        apiStore.get(true, `tickets/${ticket.id}/badge-forms`).then((res) => {
          res
            .filter(
              (field) => field.field_identifier !== 'QR' && field.field_identifier !== 'email'
            ) // remove QR code and email
            .forEach((option) => {
              filterOptions.value.push({
                id: option.field_identifier,
                name: option.custom_field,
                ticket: ticket.name,
                show: ref(false)
              })
            })
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function getTicketAttendee(ticketId) {
    try {
      const res = await apiStore.get(true, `orders/${ticketId}/attendees`)
      return res.data[0]
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { filterOptions, $reset, getBadgeFormFields, getTicketAttendee }
})
