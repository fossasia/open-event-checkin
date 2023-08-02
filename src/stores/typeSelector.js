import { computed, ref } from 'vue'
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

  const eventStations = ref([])

  async function getStations(eventId) {
    await useApiStore()
      .get(true, `events/${eventId}/stations`)
      .then((res) => {
        eventStations.value = res.data
      })
      .catch((error) => {
        throw error
      })
  }

  const registrationStations = computed(() => {
    let arr = [
      {
        id: 'create-new',
        name: 'Create New'
      }
    ]

    const d = eventStations.value
      .filter((station) => {
        return station.attributes['station-type'] === 'registration'
      })
      .map((station) => {
        return {
          id: station.id,
          name: station.attributes['station-name']
        }
      })

    return arr.concat(d)
  })

  const checkInDailyStations = computed(() => {
    let arr = [
      {
        id: 'create-new',
        name: 'Create New'
      }
    ]

    const d = eventStations.value
      .filter((station) => {
        return station.attributes['station-type'] === 'daily'
      })
      .map((station) => {
        return {
          id: station.id,
          name: station.attributes['station-name']
        }
      })

    return arr.concat(d)
  })

  const checkInStations = computed(() => {
    return eventStations.value
      .filter((station) => {
        return station.attributes['station-type'] === 'check in'
      })
      .map((station) => {
        return {
          id: station.id,
          name: station.attributes['station-name'],
          microlocationId: station.attributes['microlocation-id']
        }
      })
  })

  const checkOutStations = computed(() => {
    return eventStations.value
      .filter((station) => {
        return station.attributes['station-type'] === 'check out'
      })
      .map((station) => {
        return {
          id: station.id,
          name: station.attributes['station-name'],
          microlocationId: station.attributes['microlocation-id']
        }
      })
  })

  return {
    eventStations,
    registrationStations,
    checkInDailyStations,
    checkInStations,
    checkOutStations,
    getStations,
    stationTypes
  }
})
