import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useEventsStore = defineStore('events', () => {
  const userEvents = ref([])
  const eventMicrolocations = ref([])
  const eventName = ref('')

  async function getEvents() {
    await useApiStore()
      .get(true, 'users/user-details/get-user-id') // get user id
      .then(async (res) => {
        // clear userEvents
        userEvents.value = []
        // get user list of events
        await useApiStore()
          .get(true, `users/${res.user_id}/events`)
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
            throw error
          })
      })
      .catch((error) => {
        throw error
      })
  }

  async function getEventMicrolocations(eventId) {
    await useApiStore()
      .get(true, `events/${eventId}/microlocations`)
      .then((res) => {
        // clear eventMicrolocations
        eventMicrolocations.value = []
        // remap data to new key
        res.data.forEach((microlocation) => {
          eventMicrolocations.value.push({
            id: microlocation.id,
            name: microlocation.attributes.name
          })
        })
      })
      .catch((error) => {
        throw error
      })
  }

  async function getEventName(eventId) {
    // should not use this api to get events list
    // should use getevents then check from inside the list
    // means the user dont have access to the event
    // redirect to 404
    const event = await useApiStore().get(true, `events/${eventId}`)
    eventName.value = event.data.attributes.name
    return eventName.value
  }
  
  return { userEvents, eventMicrolocations, getEvents, getEventMicrolocations, getEventName }
})
