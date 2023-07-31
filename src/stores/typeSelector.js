import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useTypeSelectorStore = defineStore('typeSelector', () => {
  const stationTypes = [
    { id: 'registration-kiosk', name: 'Registration (via scan)', href: 'registerKiosk' },
    { id: 'registration-hybrid', name: 'Registration (hybrid)', href: 'registerHybrid' },
    { id: 'check-in-daily', name: 'Daily Check-In', href: 'scanner' },
    { id: 'check-in', name: 'Session Check-In', href: 'scanner' },
    { id: 'checkout', name: 'Session Checkout', href: 'scanner' }
  ]

  const stations = ref([])
  // breakdown of for stationTypes


  async function getStations(eventId) {
    // clear eventStations
    stations.value = []
    // init with create new option
    stations.value.push({
      id: 'create-new',
      name: 'Create New',
      microlocationId: '',
      stationType: '',
      room: ''
    })
    
    await useApiStore().get(true, `events/${eventId}/stations`).then((res) => {
      // remap data to new key
      res.data.forEach((station) => {
        stations.value.push({
          id: station.id,
          name: station.attributes['name'],
          microlocationId: station.attributes['microlocation-id'],
          stationType: station.attributes['daily'],
          room: station.attributes['room']
        })
      })
    }).catch((error) => {
      throw(error)
    })
  }

  return { stations, getStations, stationTypes }
})
