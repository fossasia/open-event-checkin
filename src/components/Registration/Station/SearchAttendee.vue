<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useAttendeesStore } from '@/stores/attendees'
import { useTicketsStore } from '@/stores/tickets'
import { useProcessRegistrationStore } from '@/stores/processRegistration'
import { usePrintModalStore } from '@/stores/printModal'
import StandardButton from '@/components/Common/StandardButton.vue'
import {
  CheckIcon,
  ArrowUturnLeftIcon,
  FunnelIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PrinterIcon
} from '@heroicons/vue/20/solid'
import { ExclamationCircleIcon, UserIcon } from '@heroicons/vue/24/outline'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'

const loadingStore = useLoadingStore()
const attendeesStore = useAttendeesStore()
const ticketsStore = useTicketsStore()
const processRegistrationStore = useProcessRegistrationStore()
const printModalStore = usePrintModalStore()

const route = useRoute()
const stationId = route.params.stationId
const eventId = route.params.eventId
const isFetchingFiltered = ref(false)
const query = ref('')

const displayMenuOpen = ref(false)
const searchByType = [
  { id: 'email', name: 'Email' },
  { id: 'name', name: 'Name' }
]

const selectedSearchBy = ref(searchByType[0])
const selectedFields = ref([])

watch(query, async (newValue) => {
  if (newValue === '' || newValue === null) {
    setTimeout(() => attendeesStore.$reset, 700)
  } else {
    isFetchingFiltered.value = true
    await attendeesStore.fetchAttendees(
      route.params.eventId,
      selectedSearchBy.value.id,
      newValue.toLowerCase()
    )
    isFetchingFiltered.value = false
  }
})

onBeforeMount(async () => {
  ticketsStore.$reset()
  await ticketsStore.getBadgeFormFields(eventId)
  loadingStore.contentLoaded()
})

const filteredAttendees = computed(() => {
  // check within info object and remove object key value if selected by search by type
  const selectedFieldsIds = selectedFields.value.map((f) => f.id)
  return attendeesStore.attendees.map((a) => {
    const info = a.info
    // check if key is in selected fields
    // if false, remove the key value pair
    Object.keys(info).forEach((key) => {
      if (!selectedFieldsIds.includes(key)) {
        delete info[key]
      }
    })
    return a
  })
})
</script>

<template>
  <div>
    <Combobox v-model="query" nullable>
      <div class="relative mb-auto rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 flex items-center">
          <Listbox v-model="selectedSearchBy" as="div">
            <ListboxButton as="template">
              <StandardButton
                :text="'Search by ' + selectedSearchBy.name"
                class="btn-white"
                :icon="MagnifyingGlassIcon"
                :icon-after="ChevronDownIcon"
                @click="displayMenuOpen = !displayMenuOpen"
              />
            </ListboxButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-secondary ring-opacity-30 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-for="d in searchByType"
                  :key="d.id"
                  v-slot="{ active, selected }"
                  as="template"
                  :value="d"
                >
                  <li
                    :class="[
                      active ? 'bg-primary text-white' : 'text-body',
                      'relative cursor-default select-none py-2 pl-10 pr-4'
                    ]"
                  >
                    <span class="block truncate">{{ d.name }}</span>
                    <span
                      v-if="selected"
                      :class="[
                        active ? 'bg-primary text-white' : 'text-body',
                        'absolute inset-y-0 left-0 flex items-center pl-3 text-primary'
                      ]"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>
        <ComboboxInput
          class="inset-y-0 block w-full pl-44 pr-32"
          :display-value="() => query"
          @change="query = $event.target.value"
        />
        <div class="absolute inset-y-0 right-0 flex items-stretch">
          <StandardButton
            v-if="query !== ''"
            :icon="XMarkIcon"
            class="text-secondary"
            @click="query = ''"
          />
          <Listbox v-model="selectedFields" multiple as="div">
            <ListboxButton as="template">
              <StandardButton
                :text="'Display'"
                :class="[selectedFields.length > 0 ? 'btn-info' : 'btn-white']"
                :icon="FunnelIcon"
                @click="displayMenuOpen = !displayMenuOpen"
              />
            </ListboxButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-40 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-secondary ring-opacity-30 focus:outline-none sm:text-sm"
              >
                <div v-if="ticketsStore.filterOptions.length === 0" class="p-2 text-center">
                  No filters found
                </div>
                <ListboxOption
                  v-for="d in ticketsStore.filterOptions"
                  :key="d.id"
                  v-slot="{ active, selected }"
                  as="template"
                  :value="d"
                >
                  <li
                    :class="[
                      active ? 'bg-primary text-white' : 'text-body',
                      'relative cursor-default select-none py-2 pl-10 pr-4'
                    ]"
                  >
                    <span class="block truncate">{{ d.name }}</span>
                    <span
                      v-if="selected"
                      :class="[
                        active ? 'bg-primary text-white' : 'text-body',
                        'absolute inset-y-0 left-0 flex items-center pl-3 text-primary'
                      ]"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
                <ListboxOption as="div" class="p-2 text-center">
                  <StandardButton
                    :text="'Reset'"
                    :icon="ArrowUturnLeftIcon"
                    class="btn-secondary w-full justify-center"
                    @click="selectedFields = [false]"
                  />
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>
      </div>

      <ComboboxOptions
        v-if="filteredAttendees.length > 0 && !isFetchingFiltered"
        static
        class="mt-5 max-h-96 scroll-py-3 divide-y divide-secondary overflow-y-auto rounded-md p-3 ring-1 ring-secondary"
      >
        <ComboboxOption
          v-for="attendee in filteredAttendees"
          :key="attendee.id"
          :value="attendee"
          :disabled="true"
          as="template"
        >
          <li class="flex cursor-default select-none p-3">
            <div
              class="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-secondary-light"
            >
              <UserIcon class="h-6 w-6" aria-hidden="true" />
            </div>
            <div class="ml-4 flex-auto">
              <p class="text-base">
                {{ attendee.name }}
              </p>
              <p class="text-base">
                {{ attendee.email }}
              </p>
              <div v-if="attendee.info" class="mt-3">
                <template v-for="(info, key) in attendee.info" :key="key">
                  <span
                    v-if="info"
                    class="my-1 mr-1 inline-block rounded-full bg-secondary-light px-2 py-1 align-middle text-xs font-medium text-secondary-dark"
                    >{{ info }}</span
                  >
                </template>
              </div>
              <div class="mt-3 flex items-center justify-end gap-2">
                <StandardButton
                  :icon="ArrowRightOnRectangleIcon"
                  :disabled="attendee.checkedIn"
                  :text="attendee.checkedIn ? 'Checked-in' : 'Check-in'"
                  :class="[attendee.checkedIn ? 'btn-secondary' : 'btn-success']"
                  @click="
                    processRegistrationStore.processRegistrationCheckin(attendee.id, stationId)
                  "
                />
                <StandardButton
                  :text="'Print'"
                  :icon="PrinterIcon"
                  class="btn-info"
                  @click="printModalStore.setPrintDetails(attendee.ticketId, attendee.id)"
                />
              </div>
            </div>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
      <div
        v-if="query !== '' && filteredAttendees.length === 0 && !isFetchingFiltered"
        class="mt-5 rounded-md px-6 py-14 text-center text-sm ring-1 ring-secondary sm:px-14"
      >
        <ExclamationCircleIcon name="exclamation-circle" class="mx-auto h-10 w-10 text-info" />
        <p class="mt-4 font-semibold">No attendees found. Please try again.</p>
      </div>
      <div
        v-if="query !== '' && isFetchingFiltered"
        class="mt-5 flex flex-col justify-start rounded-md py-14 text-center text-sm ring-1 ring-secondary"
      >
        <p class="mb-4 text-base font-semibold">Fetching attendees. Please wait...</p>
        <div class="flex animate-pulse p-3">
          <div class="h-12 w-12 rounded-full bg-secondary-light"></div>
          <div class="ml-4 flex-auto space-y-3">
            <div class="h-4 rounded bg-secondary-light"></div>
            <div class="h-4 rounded bg-secondary-light"></div>
            <div class="mt-3 text-left">
              <span
                v-for="n in 4"
                :key="n"
                class="my-1 mr-1 inline-block h-4 w-16 rounded-full bg-secondary-light"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </Combobox>
  </div>
</template>
