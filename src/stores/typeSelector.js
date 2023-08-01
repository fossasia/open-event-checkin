import { ref } from 'vue'
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

  const registrationStations = ref([])
  const checkInDailyStations = ref([])
  const checkInStations = ref([])
  const checkOutStations = ref([])

  async function getStations(eventId) {
    // clear eventStations
    registrationStations.value = []
    checkInDailyStations.value = []
    checkInStations.value = []
    checkOutStations.value = []
    // add create new option
    const obj = {
      id: 'create-new',
      name: 'Create New'
    }
    registrationStations.value.push(obj)
    checkInDailyStations.value.push(obj)

    await useApiStore()
      .get(true, `events/${eventId}/stations`)
      .then((res) => {
        // remap data to new key
        // types: registration | daily | check in | check out
        res.data.forEach((station) => {
          const stationType = station.attributes['station-type']
          if (stationType === 'registration') {
            registrationStations.value.push({
              id: station.id,
              name: station.attributes['station-name']
            })
          } else if (stationType === 'daily') {
            checkInDailyStations.value.push({
              id: station.id,
              name: station.attributes['station-name']
            })
          } else if (stationType === 'check in') {
            checkInStations.value.push({
              id: station.id,
              name: station.attributes['station-name'],
              microlocationId: station.attributes['microlocation-id']
            })
          } else if (stationType === 'check out') {
            checkOutStations.value.push({
              id: station.id,
              name: station.attributes['station-name'],
              microlocationId: station.attributes['microlocation-id']
            })
          } else {
            console.log('station type not found')
          }
        })
      })
      .catch((error) => {
        throw error
      })
  }

  return {
    registrationStations,
    checkInDailyStations,
    checkInStations,
    checkOutStations,
    getStations,
    stationTypes
  }
})
