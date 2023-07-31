<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import { useApiStore } from '@/stores/api'
import { useEventsStore } from '@/stores/events'
import { useTypeSelectorStore } from '@/stores/typeSelector'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
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

watch(selectedEvent, async (newValue) => {
  if (newValue.id !== null) {
    typeSelectorStore.getStations(newValue.id)
    eventsStore.getEventRooms(newValue.id)
  }
})

const selectedType = ref({
  id: null,
  name: '',
  href: ''
})

const isStationType = computed(() => {
  if (selectedType.value.id === 'registration-kiosk' || selectedType.value.id === 'registration-hybrid' || selectedType.value.id === 'check-in-daily') {
    return true
  }

  if (selectedType.value.id === 'check-in' || selectedType.value.id === 'checkout') {
    return false
  }
})

const selectedRoom = ref({
  id: null,
  name: ''
})

const selectedStation = ref({
  id: null,
  name: ''
})

const newStationName = ref('')

const displayCreateNewRoom = computed(() => {
  if (selectedType.value.id === 'check-in' || selectedType.value.id === 'checkout') {
    return false
  }

  if (selectedType.value.id === 'check-in-daily' || selectedType.value.id === 'registration-kiosk' || selectedType.value.id === 'registration-hybrid') {
    if (selectedStation.value.id === 'create-new') {
      return true
    }
  }

  return false
})

const allFieldsSelected = computed(() => {
  if (selectedEvent.value.id === null || selectedType.value.id === null) {
    return false
  }

  if (selectedType.value.id === 'check-in' || selectedType.value.id === 'checkout') {
    if (selectedRoom.value.id === null) {
      return false
    }
  }

  if (selectedType.value.id === 'check-in-daily' || selectedType.value.id === 'registration-kiosk' || selectedType.value.id === 'registration-hybrid') {
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

async function submitForm() {
  localStorage.setItem('event_id', selectedEvent.value.id)
  loadingStore.show = true
  if (
    selectedType.value.id == 'registration-kiosk' ||
    selectedType.value.id == 'registration-hybrid' ||
    selectedType.value.id == 'check-in-daily'
  ) {
    // if create new station is selected, create new station

    if (selectedStation.value.id === 'create-new') {
    const payload = {
     "data": {
         "attributes": {
             "station-name": newStationName.value,
             "station-type": (selectedType.value.id === 'check-in-daily') ? 'daily' : 'registration'
         },
         "relationships": {
             "event": {
                 "data": {
                     "type": "event",
                     "id": selectedEvent.value.id
                 }
             }
         },
         "type": "station"
     }
   }

    await apiStore.post(true, 'station', payload, false)
    .then(async (res) => {
      console.log(res)
      loadingStore.show = false
     
    })
    .catch((err) => {
      loadingStore.show = false
      console.log(err)
    })
  }

    // router.push({
    //   name: selectedType.value.href,
    //   params: {
    //     eventId: selectedEvent.value.id,
    //     registrationType: selectedType.value.id
    //   }
    // })
  } else {
    router.push({
      name: selectedType.value.href,
      params: {
        eventId: selectedEvent.value.id,
        roomId: selectedRoom.value.id,
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
      <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Select Event
      </h2>
      <form class="space-y-3 mt-10" @submit.prevent="submitForm">
        <Listbox v-model="selectedEvent" as="div">
          <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
            >Event</ListboxLabel
          >
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <span v-if="selectedEvent.name == ''" class="block truncate text-gray-400"
                >Select Event</span
              >
              <span class="block truncate">{{ selectedEvent.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="event in eventsStore.userEvents"
                :key="event.id"
                v-slot="{ active, selected }"
                as="template"
                :value="event"
              >
                <li
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  ]"
                >
                <span
                    :class="[active ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ event.name }}</span
                  >

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-blue-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>

        <!-- select booth type -->

        <Listbox v-model="selectedType" as="div">
          <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
            >Type</ListboxLabel
          >
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
            <span v-if="selectedType.name == ''" class="block truncate text-gray-400"
                >Select Type</span
              >
              <span class="block truncate">{{ selectedType.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="stationType in typeSelectorStore.stationTypes"
                :key="stationType.id"
                v-slot="{ active, selected }"
                :value="stationType"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  ]"
                >
                  <span
                    :class="[active ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ stationType.name }}</span
                  >

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-blue-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
        <!-- allow user to select booth or give a new field to store booth -->
        <!-- for session checkin and checkout, only retrieve locations from api and not able to create new -->
        <Listbox
          v-if="isStationType"
          v-model="selectedStation"
          as="div"
        >
          <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
            >Selected Station</ListboxLabel
          >
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
            <span v-if="selectedStation.name == ''" class="block truncate text-gray-400"
                >Select Station</span
              >
              <span class="block truncate">{{ selectedStation.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="station in typeSelectorStore.stations"
                :key="station.id"
                v-slot="{ active, selected }"
                as="template"
                :value="station"
              >
                <li
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  ]"
                >
                  <span
                    :class="[active ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ station.name }}</span
                  >

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-blue-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>

        <!-- allow user to select room or give a new field to store room -->
        <!-- for room checkin and checkout, only retrieve locations from api and not able to create new -->
        <Listbox
          v-if="!isStationType && isStationType !== undefined"
          v-model="selectedRoom"
          as="div"
        >
          <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
            >Selected Room</ListboxLabel
          >
          <div class="relative mt-2">
            <ListboxButton
              class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <span v-if="selectedRoom.name == ''" class="block truncate text-gray-400"
                >Select Room</span
              >
              <span class="block truncate">{{ selectedRoom.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="room in eventsStore.eventRooms"
                :key="room.id"
                v-slot="{ active, selected }"
                :value="room"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  ]"
                >
                  <span
                    :class="[active ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ room.name }}</span
                  >

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-blue-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>

        <!-- display if create new booth is selected -->
        <div
          v-if="
            selectedStation.id == 'create-new' &&
            (selectedType.id == 'registration-kiosk' ||
              selectedType.id == 'registration-hybrid' ||
              selectedType.id == 'check-in-daily')
          "
        >
          <label for="station" class="block text-sm font-medium leading-6 text-gray-900"
            >Station Name</label
          >
          <div class="mt-2">
            <input
              id="station"
              name="station"
              type="text"
              required="true"
              v-model="newStationName"
              placeholder="Enter station name"
              class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <StandardButton
            :disabled="!allFieldsSelected"
            type="submit"
            text="Go"
            class="bg-blue-600 text-white hover:bg-blue-500 w-full mt-6 justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          />
        </div>
      </form>
    </div>
  </div>
</template>
