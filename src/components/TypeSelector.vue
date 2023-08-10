<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useApiStore } from '@/stores/api'
import { useEventsStore } from '@/stores/events'
import { useTypeSelectorStore } from '@/stores/typeSelector'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import ListboxSelector from '@/components/Shared/ListboxSelector.vue'
import StandardButton from '@/components/Shared/StandardButton.vue'

// stores
const apiStore = useApiStore()
const eventsStore = useEventsStore()
const loadingStore = useLoadingStore()
const typeSelectorStore = useTypeSelectorStore()

// router
const router = useRouter()

onMounted(async () => {
  loadingStore.show = true
  eventsStore
    .getEvents()
    .then(() => {
      loadingStore.show = false
    })
    .catch(() => {
      // if error, kick user to login page
      router.replace({
        name: 'userAuth'
      })
      loadingStore.show = false
    })
})

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

watch(selectedEvent, async (newValue) => {
  if (newValue.id !== null) {
    typeSelectorStore.getStations(newValue.id)
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

watch(selectedType, async (newValue) => {
  // type change so clear all fields after
  selectedMicrolocation.value = {
    id: null,
    name: ''
  }
  selectedStation.value = {
    id: null,
    name: ''
  }
  newStationName.value = ''
})

const availableStations = computed(() => {
  if (
    selectedType.value.id === 'registration-kiosk' ||
    selectedType.value.id === 'registration-hybrid'
  ) {
    return typeSelectorStore.registrationStations
  } else if (selectedType.value.id === 'check-in-daily') {
    return typeSelectorStore.checkInDailyStations
  } else {
    return []
  }
})

const allFieldsSelected = computed(() => {
  if (selectedEvent.value.id === null || selectedType.value.id === null) {
    return false
  }

  if (selectedType.value.id === 'check-in' || selectedType.value.id === 'checkout') {
    if (selectedMicrolocation.value.id === null) {
      return false
    }
  }

  if (
    selectedType.value.id === 'check-in-daily' ||
    selectedType.value.id === 'registration-kiosk' ||
    selectedType.value.id === 'registration-hybrid'
  ) {
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

async function createStation(payload) {
  await apiStore
    .post(true, 'station', payload, false)
    .then(async (res) => {
      // update selected station to latest response
      selectedStation.value.id = res.data.id
      selectedStation.value.name = res.data.attributes['station-name']
      loadingStore.show = false
    })
    .catch((err) => {
      loadingStore.show = false
      console.log(err)
    })
}

async function submitForm() {
  loadingStore.show = true
  if (
    selectedType.value.id === 'registration-kiosk' ||
    selectedType.value.id === 'registration-hybrid' ||
    selectedType.value.id === 'check-in-daily'
  ) {
    // if create new station is selected, create new station

    if (selectedStation.value.id === 'create-new') {
      const payload = {
        data: {
          attributes: {
            'station-name': newStationName.value,
            //  registration | daily | check in | check out
            'station-type': selectedType.value.id === 'check-in-daily' ? 'daily' : 'registration'
          },
          relationships: {
            event: {
              data: {
                type: 'event',
                id: selectedEvent.value.id
              }
            }
          },
          type: 'station'
        }
      }

      await createStation(payload)
    }

    router.push({
      name: selectedType.value.href,
      params: {
        eventId: selectedEvent.value.id,
        registrationType: selectedType.value.id,
        stationId: selectedStation.value.id
      }
    })
  } else {
    // front end to lock only one station for checkin and checkout
    // station, check if station exist else create
    const payload = {
      data: {
        attributes: {
          'station-name': selectedMicrolocation.value.name,
          //  check in | check out
          'station-type': selectedType.value.id === 'check-in' ? 'check in' : 'check out'
        },
        relationships: {
          event: {
            data: {
              type: 'event',
              id: selectedEvent.value.id
            }
          },
          microlocation: {
            data: {
              id: selectedMicrolocation.value.id,
              type: 'microlocation'
            }
          }
        },
        type: 'station'
      }
    }

    if (selectedType.value.id === 'check-in') {
      if (typeSelectorStore.checkInStations.length < 1) {
        // means station not created
        await createStation(payload)
      } else {
        // set first station as selected
        selectedStation.value.id = typeSelectorStore.checkInStations[0].id
        selectedStation.value.name = typeSelectorStore.checkInStations[0].name
      }
    }

    if (selectedType.value.id === 'checkout') {
      if (typeSelectorStore.checkOutStations.length < 1) {
        // means station not created
        await createStation(payload)
      } else {
        // set first station as selected
        selectedStation.value.id = typeSelectorStore.checkOutStations[0].id
        selectedStation.value.name = typeSelectorStore.checkOutStations[0].name
      }
    }
    router.push({
      name: selectedType.value.href,
      params: {
        eventId: selectedEvent.value.id,
        stationId: selectedStation.value.id,
        scannerType: selectedType.value.id
      }
    })
  }
  loadingStore.show = false
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center my-auto">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center">Select Event</h2>
      <form class="space-y-3 mt-10" @submit.prevent="submitForm">
        <ListboxSelector
          :select-text="'Select Event'"
          :label="'Event'"
          :data="eventsStore.userEvents"
          :selectedOption="selectedEvent"
          @update-selected="(n) => (selectedEvent = n)"
        ></ListboxSelector>
        <!-- select booth type -->
        <ListboxSelector
          :select-text="'Select Type'"
          :label="'Type'"
          :data="typeSelectorStore.stationTypes"
          :selectedOption="selectedType"
          @update-selected="(n) => (selectedType = n)"
        ></ListboxSelector>
        <!-- allow user to select booth or give a new field to store booth -->
        <!-- for session checkin and checkout, only retrieve locations from api and not able to create new -->
        <ListboxSelector
          v-if="isStationType"
          :select-text="'Select Station'"
          :label="'Station'"
          :data="availableStations"
          :selectedOption="selectedStation"
          @update-selected="(n) => (selectedStation = n)"
        ></ListboxSelector>
        <!-- allow user to select microlocation or give a new field to store microlocation -->
        <!-- for microlocation checkin and checkout, only retrieve locations from api and not able to create new -->
        <ListboxSelector
          v-if="!isStationType && isStationType !== undefined"
          :select-text="'Select Microlocation'"
          :label="'Microlocation'"
          :data="eventsStore.eventMicrolocations"
          :selectedOption="selectedMicrolocation"
          @update-selected="(n) => (selectedMicrolocation = n)"
        ></ListboxSelector>

        <!-- display if create new booth is selected -->
        <div
          v-show="
            selectedStation.id == 'create-new' &&
            (selectedType.id == 'registration-kiosk' ||
              selectedType.id == 'registration-hybrid' ||
              selectedType.id == 'check-in-daily')
          "
        >
          <label for="station">Station Name</label>
          <div class="mt-2">
            <input
              id="station"
              v-model="newStationName"
              name="station"
              type="text"
              required="true"
              placeholder="Enter station name"
              class="block w-full"
            />
          </div>
        </div>

        <div>
          <StandardButton
            :disabled="!allFieldsSelected"
            type="submit"
            text="Go"
            class="btn-primary w-full mt-6 justify-center"
          />
        </div>
      </form>
    </div>
  </div>
</template>
