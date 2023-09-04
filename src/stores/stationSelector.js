import { useEventsStore } from '@/stores/events'
import { useStationsStore } from '@/stores/stations'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useStationSelectorStore = defineStore('stationSelector', () => {
  const eventsStore = useEventsStore()
  const stationsStore = useStationsStore()

  const selectedEvent = ref({
    id: null,
    name: ''
  })

  const selectedType = ref({
    id: null,
    name: '',
    href: ''
  })

  const selectedMicrolocation = ref({
    id: null,
    name: ''
  })

  const selectedStation = ref({
    id: null,
    name: ''
  })

  const newStationName = ref('')

  function $reset() {
    selectedEvent.value = {
      id: null,
      name: ''
    }
    selectedType.value = {
      id: null,
      name: '',
      href: ''
    }
    selectedMicrolocation.value = {
      id: null,
      name: ''
    }
    selectedStation.value = {
      id: null,
      name: ''
    }
    newStationName.value = ''
  }

  const isStationType = computed(() => {
    if (
      selectedType.value.id === 'registration-kiosk' ||
      selectedType.value.id === 'registration-hybrid' ||
      selectedType.value.id === 'check-in-daily'
    ) {
      return true
    } else if (selectedType.value.id === 'check-in' || selectedType.value.id === 'checkout') {
      return false
    } else {
      return undefined
    }
  })

  const isCreateNewStation = computed(() => {
    return (
      selectedStation.value.id == 'create-new' &&
      (selectedType.value.id == 'registration-kiosk' ||
        selectedType.value.id == 'registration-hybrid' ||
        selectedType.value.id == 'check-in-daily')
    )
  })

  const availableStations = computed(() => {
    if (
      selectedType.value.id === 'registration-kiosk' ||
      selectedType.value.id === 'registration-hybrid'
    ) {
      return stationsStore.registrationStations
    } else if (selectedType.value.id === 'check-in-daily') {
      return stationsStore.checkInDailyStations
    } else {
      return []
    }
  })

  const isRegistrationStations = computed(() => {
    return (
      selectedType.value.id === 'registration-kiosk' ||
      selectedType.value.id === 'registration-hybrid' ||
      selectedType.value.id === 'check-in-daily'
    )
  })

  const validation = computed(() => {
    if (selectedEvent.value.id === null || selectedType.value.id === null) {
      return false
    }

    if (selectedType.value.id === 'check-in' || selectedType.value.id === 'checkout') {
      return selectedMicrolocation.value.id !== null && selectedMicrolocation.value.id !== ''
    }

    if (isRegistrationStations.value) {
      if (selectedStation.value.id === null) {
        return false
      }
      if (selectedStation.value.id === 'create-new') {
        if (newStationName.value === '') {
          return false
        }
      }
    }

    return true
  })

  watch(selectedEvent, async (newValue) => {
    if (newValue.id !== null) {
      stationsStore.getStations(newValue.id)
      eventsStore.getEventMicrolocations(newValue.id)
      // clear all fields after
      selectedType.value = {
        id: null,
        name: '',
        href: ''
      }
      selectedMicrolocation.value = {
        id: null,
        name: ''
      }
      selectedStation.value = {
        id: null,
        name: ''
      }
      newStationName.value = ''
    }
  })

  watch(selectedType, async (newValue, oldValue) => {
    // type change so clear all fields after
    selectedMicrolocation.value = {
      id: null,
      name: ''
    }
    if (oldValue) {
      if (
        (oldValue.id === 'registration-kiosk' || oldValue.id === 'registration-hybrid') &&
        (newValue.id === 'registration-kiosk' || newValue.id === 'registration-hybrid')
      ) {
        // do nothing
      } else {
        // selected not registration so reset
        selectedStation.value = {
          id: null,
          name: ''
        }
      }
    }
    newStationName.value = ''
  })

  async function createStation(payload) {
    try {
      const res = await stationsStore.createStation(payload)
      // set as selected to move on
      selectedStation.value.id = res.id
      selectedStation.value.name = res.attributes['station-name']
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    selectedEvent,
    selectedType,
    selectedMicrolocation,
    selectedStation,
    newStationName,
    isStationType,
    isRegistrationStations,
    isCreateNewStation,
    availableStations,
    validation,
    createStation,
    $reset
  }
})
