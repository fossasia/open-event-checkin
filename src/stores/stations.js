import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useStationsStore = defineStore('stations', () => {
  const apiStore = useApiStore()

  const stationTypes = [
    {
      id: 'registration-kiosk',
      type: 'registration',
      name: 'Registration Kiosk (with Scan only)',
      href: 'registerKiosk'
    },
    {
      id: 'registration-hybrid',
      type: 'registration',
      name: 'Registration Station (with Scan & Search)',
      href: 'registerStation'
    },
    { id: 'daily', type: 'daily', name: 'Daily Check-In', href: 'checkIn' },
    { id: 'check-in', type: 'check in', name: 'Session Check-In', href: 'checkIn' },
    { id: 'checkout', type: 'check out', name: 'Session Checkout', href: 'checkIn' }
  ]

  const actualEventStations = ref([])
  const eventStations = ref([])

  function $reset() {
    actualEventStations.value = []
    eventStations.value = []
  }

  async function getStations(eventId) {
    try {
      const res = await apiStore.get(true, `events/${eventId}/stations?page[size]=1000`)
      actualEventStations.value = res.data
      // clone data to remove reactivity
      let data = JSON.parse(JSON.stringify(res.data))

      // check for those with microlocation-id in attributes to replace id with microlocation-id
      data.forEach((station) => {
        if (station.attributes['microlocation-id']) {
          station.id = station.attributes['microlocation-id']
        }
      })
      eventStations.value = data

    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getActualStationId(stationId, scannerType) {
    let station = null
    if (scannerType === 'check-in') {
      station = checkInStations.value.find((s) => {
        return s.microlocationId === Number(stationId)
      })
    } else if (scannerType === 'checkout') {
      station = checkOutStations.value.find((s) => {
        return s.microlocationId === Number(stationId)
      })
    } else {
      // find station object in case spoofing via url
      station = actualEventStations.value.find((s) => {
        return s.id === Number(stationId)
      })
    }  

    if (station === null) {
      return false
    }
    
    return station.id
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
    return actualEventStations.value
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
    return actualEventStations.value
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
    $reset,
    createStation,
    registrationStations,
    checkInDailyStations,
    checkInStations,
    checkOutStations,
    getStations,
    getActualStationId,
    stationTypes
  }
})
