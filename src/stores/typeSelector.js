import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTypeSelectorStore = defineStore('typeSelector', () => {
  const eventNames = [
    { id: 1, name: 'Leslie Alexander' }
    // More events...
  ]

  const stationTypes = [
    { id: 'registration-scan', name: 'Registration (via scan)', href: 'registerScan' },
    { id: 'registration-search', name: 'Registration (via search)', href: 'registerSearch' },
    { id: 'registration-hybrid', name: 'Registration (hybrid)', href: 'registerHybrid' },
    { id: 'check-in-daily', name: 'Daily Check-In', href: 'scannerCamera' },
    { id: 'check-in', name: 'Session Check-In', href: 'scannerCamera' },
    { id: 'checkout', name: 'Session Checkout', href: 'scannerCamera' }
  ]

  const availableStations = [
    { id: 'none', name: 'Create New' },
    { id: '1', name: 'Booth 1' },
    { id: '2', name: 'Booth ABC' },
    { id: '3', name: 'Door 1' }
  ]

  return { eventNames, stationTypes, availableStations }
})
