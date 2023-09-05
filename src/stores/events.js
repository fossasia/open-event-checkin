import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventsStore = defineStore('events', () => {
  const apiStore = useApiStore()
  const userEvents = ref([])
  const eventMicrolocations = ref([])
  const eventName = ref('')

  function $reset() {
    userEvents.value = []
    eventMicrolocations.value = []
    eventName.value = ''
  }

  async function getEvents() {
    try {
      const res = await apiStore.get(true, 'users/user-details/get-user-id') // get user id
      // clear userEvents
      userEvents.value = []

      // get user list of events
      const r = await apiStore.get(true, `users/${res.user_id}/events?page[size]=1000`)

      // remap data to new key
      r.data.forEach((event) => {
        userEvents.value.push({
          id: event.id,
          name: event.attributes.name
        })
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getEventMicrolocations(eventId) {
    try {
      const res = await apiStore.get(true, `events/${eventId}/microlocations?page[size]=1000`)

      // clear eventMicrolocations
      eventMicrolocations.value = []
      // remap data to new key
      res.data.forEach((microlocation) => {
        eventMicrolocations.value.push({
          id: microlocation.id,
          name: microlocation.attributes.name
        })
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getEventName(eventId) {
    // should not use this api to get events list
    // should use getevents then check from inside the list
    // means the user dont have access to the event
    // redirect to 404
    try {
      const event = await apiStore.get(true, `events/${eventId}`)
      eventName.value = event.data.attributes.name
      return eventName.value
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    eventName,
    userEvents,
    eventMicrolocations,
    $reset,
    getEvents,
    getEventMicrolocations,
    getEventName
  }
})
