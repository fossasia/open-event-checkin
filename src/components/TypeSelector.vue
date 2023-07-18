<script setup>
import { computed, ref } from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import StandardButton from '@/components/Shared/StandardButton.vue'

const eventNames = [
  { id: 1, name: 'Leslie Alexander' }
  // More events...
]

const query = ref('')
const selectedEvent = ref(null)
const filteredEvents = computed(() =>
  query.value === ''
    ? eventNames
    : eventNames.filter((person) => {
        return person.name.toLowerCase().includes(query.value.toLowerCase())
      })
)

const stationTypes = [
  { id: 'registration-scan', name: 'Registration (via scan)', href: 'registerScan' },
  { id: 'registration-search', name: 'Registration (via search)', href: 'registerSearch' },
  { id: 'registration-hybrid', name: 'Registration (hybrid)', href: 'registerHybrid' },
  { id: 'check-in-daily', name: 'Daily Check-In', href: 'scannerCamera' },
  { id: 'check-in', name: 'Session Check-In', href: 'scannerCamera' },
  { id: 'checkout', name: 'Session Checkout', href: 'scannerCamera' }
]

const selectedType = ref(stationTypes[1])

const availableStations = [
  { id: 'none', name: 'Create New' },
  { id: '1', name: 'Booth 1' },
  { id: '2', name: 'Booth ABC' },
  { id: '3', name: 'Door 1' }
]

const selectedStation = ref(availableStations[1])
</script>

<template>
  <div class="flex flex-1 flex-col justify-center p-6 my-auto">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Select Event
      </h2>
      <form class="space-y-6 mt-10" action="#" method="POST">
        <Combobox as="div" v-model="selectedEvent">
          <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900"
            >Event Name</ComboboxLabel
          >
          <div class="relative mt-2">
            <ComboboxInput
              class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-1 focus:ring-blue-600 sm:text-sm sm:leading-6"
              @change="query = $event.target.value"
              :display-value="(person) => event?.name"
            />
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
            >
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>

            <ComboboxOptions
              v-if="filteredEvents.length > 0"
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ComboboxOption
                v-for="event in filteredEvents"
                :key="event.id"
                :value="event"
                as="template"
                v-slot="{ selected }"
              >
                <li :class="['relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900']">
                  <span :class="['block truncate', selected && 'font-semibold']">
                    {{ event.name }}
                  </span>

                  <span
                    v-if="selected"
                    :class="['absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600']"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </div>
        </Combobox>

        <!-- select booth type -->

        <Listbox as="div" v-model="selectedType">
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
                as="template"
                v-for="stationType in stationTypes"
                :key="stationType.id"
                :value="stationType"
                v-slot="{ active, stationTypes }"
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
        <Listbox as="div" v-model="selectedStation">
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
                as="template"
                v-for="station in availableStations"
                :key="station.id"
                :value="station"
                v-slot="{ active, availableStations }"
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

        <!-- display if create new booth is selected -->
        <div>
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
          <RouterLink
            :to="{ name: 'registration', params: { registrationType: 'scan', eventId: '1' } }"
          >
            <StandardButton
              type="submit"
              text="Go"
              class="bg-blue-600 text-white hover:bg-blue-500 w-full justify-center"
            />
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
