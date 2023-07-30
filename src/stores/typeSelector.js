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

  const availableStations = [
    { id: 'none', name: 'Create New' },
    { id: '1', name: 'Booth 1' },
    { id: '2', name: 'Booth ABC' },
    { id: '3', name: 'Door 1' }
  ]

  async function getStations(eventId) {
    const stations = []
    const stationRes = await useApiStore().get(true, `events/${eventId}/stations`)
    for (const station of stationRes.data) {
      stations.push({
        id: station.id,
        name: station.attributes['station-name'],
        microlocationId: station.attributes['microlocation-id'],
        stationType: station.attributes['daily'],
        room: station.attributes['room']
      })
    }
    return stations
  }

  return { getStations, stationTypes, availableStations }
})
