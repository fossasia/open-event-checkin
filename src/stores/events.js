import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useEventsStore = defineStore('events', () => {
  const userEvents = ref([])
  const eventRooms = ref([])

  async function getEvents() {
    await useApiStore()
      .get(true, 'users/user-details/get-user-id') // get user id
      .then(async (res) => {
        // clear userEvents
        userEvents.value = []
        // get user list of events
        await useApiStore().get(true, `users/${res.user_id}/events`)
        .then((res) => {
          // remap data to new key
          res.data.forEach((event) => {
            userEvents.value.push({
              id: event.id,
              name: event.attributes.name
            })
          })
        })
        .catch((error) => {
          throw(error)
        })
      }).catch((error) => {
        throw(error)
      })
    }

  async function getEventRooms(eventId) {
    await useApiStore().get(true, `events/${eventId}/microlocations`).then((res) => {
      // clear eventRooms
      eventRooms.value = []
      // remap data to new key
      res.data.forEach((room) => {
        eventRooms.value.push({
          id: room.id,
          name: room.attributes.name
        })
      })
    }).catch((error) => {
      throw(error)
    })
  }

  async function getEventName(eventId) {

    const event = await useApiStore().get(true, `events/${eventId}`)
    return event.data.attributes.name
  }

  function getEventId() {
    return localStorage.getItem('event_id')
  }

  return { userEvents, eventRooms, getEvents, getEventRooms, getEventName, getEventId }
})
