import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useStationsStore = defineStore('stations', () => {
  const apiStore = useApiStore()

  const stationTypes = [
    { id: 'registration-kiosk', name: 'Registration (via scan)', href: 'registerKiosk' },
    { id: 'registration-hybrid', name: 'Registration (hybrid)', href: 'registerHybrid' },
    { id: 'check-in-daily', name: 'Daily Check-In', href: 'scanner' },
    { id: 'check-in', name: 'Session Check-In', href: 'scanner' },
    { id: 'checkout', name: 'Session Checkout', href: 'scanner' }
  ]

  const actualEventStations = ref([])
  const eventStations = ref([])

  async function getStations(eventId) {
    try {
      const res = await apiStore.get(true, `events/${eventId}/stations`)
      actualEventStations.value = res.data
      // check for those with microlocation-id in attributes to replace id with microlocation-id
      res.data.forEach((station) => {
        if (station.attributes['microlocation-id']) {
          station.id = station.attributes['microlocation-id']
        }
      })
      eventStations.value = res.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getStationIdWithMicrolocation(microlocationId) {
    // assuming index of actualEventStations is the same as eventStations
    // find index of station with microlocation-id
    const index = eventStations.value.findIndex((station) => {
      station.id === microlocationId
    })
    // get station id from actualEventStations
    return actualEventStations.value[index].id
  }

  async function createStation(payload) {
    try {
      const res = await apiStore.post(true, 'station', payload)
      return res.data
    } catch (error) {
      return Promise.reject(error)
    }
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
    createStation,
    registrationStations,
    checkInDailyStations,
    checkInStations,
    checkOutStations,
    getStations,
    getStationIdWithMicrolocation,
    stationTypes
  }
})
