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
import { useEventsStore } from '@/stores/events'
import { useTypeSelectorStore } from '@/stores/typeSelector'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import StandardButton from '@/components/Shared/StandardButton.vue'

// stores
const eventsStore = useEventsStore()
const loadingStore = useLoadingStore()
const typeSelectorStore = useTypeSelectorStore()

// router
const router = useRouter()

// form data
const allEvents = ref([])

// Gets events { id: 169, name: 'Test Event', rooms: Array}
onMounted(async () => {
  loadingStore.show = true
  eventsStore
    .getEvents()
    .then((res) => {
      allEvents.value = res
      loadingStore.show = false
    })
    .catch(() => {
      // if error, kick user to login page
      router.push({
        name: 'userAuth'
      })
      loadingStore.show = false
    })
})

// Create event names array for type selector
const eventNames = computed(() =>
  allEvents.value.map((event) => {
    return {
      id: event.id,
      name: event.name
    }
  })
)

const selectedEvent = ref({
  id: null,
  name: '',
  rooms: null
})

const selectedType = ref(typeSelectorStore.stationTypes[0])

// Create available rooms array for type selector if SESSION TYPE selected
const availableRooms = computed(() => {
  if (selectedEvent.value === null) {
    return []
  }
  if (selectedEvent.value.rooms === null) {
    return []
  }
  return allEvents.value
    .find((event) => event.id === selectedEvent.value.id)
    .rooms.map((room) => {
      return {
        id: room.id,
        name: room.name
      }
    })
})

const selectedRoom = ref({
  id: null,
  name: ''
})

const availableStations = [
  { id: 'none', name: 'Create New' },
  { id: '1', name: 'Booth 1' },
  { id: '2', name: 'Booth ABC' },
  { id: '3', name: 'Door 1' }
]
watch(selectedEvent, () => {
  eventsStore.setEventId(selectedEvent.value.id)
  //typeSelectorStore.getStations(event.id) // doesnt work
})

const selectedStation = ref(availableStations[1])

async function submitForm() {
  console.log(selectedType.value.href)
  loadingStore.show = true
  if (
    selectedType.value.id == 'registration-kiosk' ||
    selectedType.value.id == 'registration-hybrid' ||
    selectedType.value.id == 'check-in-daily'
  ) {
    router.push({
      name: selectedType.value.href,
      params: {
        eventId: selectedEvent.value.id,
        registrationType: selectedType.value.id
      }
    })
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
      <form class="space-y-6 mt-10" @submit.prevent="submitForm">
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
                v-for="event in eventNames"
                :key="event.id"
                v-slot="{ active }"
                as="template"
                :value="event"
              >
                <li
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  ]"
                >
                  <span :class="[eventNames ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                    event.name
                  }}</span>

                  <span
                    v-if="eventNames"
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
                v-slot="{ active, stationTypes }"
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
                    :class="[stationTypes ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ stationType.name }}</span
                  >

                  <span
                    v-if="stationTypes"
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
          v-if="
            selectedType.id == 'registration-kiosk' ||
            selectedType.id == 'registration-hybrid' ||
            selectedType.id == 'check-in-daily'
          "
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
              <span class="block truncate">{{ selectedStation.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-for="station in availableStations"
                :key="station.id"
                v-slot="{ active, availableStations }"
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
                    :class="[availableStations ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ station.name }}</span
                  >

                  <span
                    v-if="availableStations"
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
          v-if="selectedType.id == 'check-in' || selectedType.id == 'checkout'"
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
                v-for="room in availableRooms"
                :key="room.id"
                v-slot="{ active }"
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
                    :class="[availableRooms ? 'font-semibold' : 'font-normal', 'block truncate']"
                    >{{ room.name }}</span
                  >

                  <span
                    v-if="availableRooms"
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
            selectedStation.id == 'none' &&
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
              class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <StandardButton
            type="submit"
            text="Go"
            class="bg-blue-600 text-white hover:bg-blue-500 w-full mt-6 justify-center"
          />
        </div>
      </form>
    </div>
  </div>
</template>
