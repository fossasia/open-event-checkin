<script setup>
import { ref, watch } from 'vue'
import { XCircleIcon, MagnifyingGlassIcon, PrinterIcon } from '@heroicons/vue/20/solid'

const query = ref('')
const typing = ref(false)
const searchBar = ref(null)

const erase = () => {
  query.value = ''
}

watch(query, () => {
  if (query.value !== '') typing.value = true
  else typing.value = false
})

const checkIn = (item) => {
  item.checkedIn.value = true
}

const items = [
  {
    id: 1,
    name: 'Wei Tat Chung',
    position: 'Chairperson',
    role: 'Organiser',
    email: 'wtc@email.com',
    organisation: 'SUSS AI-IG',
    checkedIn: ref(false)
  },
  {
    id: 2,
    name: 'Shaun Laclemence',
    position: 'Chairperson',
    role: 'Organiser',
    email: 'wtc@email.com',
    organisation: 'SUSS AI-IG',
    checkedIn: ref(false)
  },
  {
    id: 3,
    name: 'Don Chia',
    position: 'Chairperson',
    role: 'Organiser',
    email: 'wtc@email.com',
    organisation: 'SUSS AI-IG',
    checkedIn: ref(false)
  },
  {
    id: 3,
    name: 'Don Chia',
    position: 'Chairperson',
    role: 'Organiser',
    email: 'wtc@email.com',
    organisation: 'SUSS AI-IG',
    checkedIn: ref(false)
  },
  {
    id: 3,
    name: 'Don Chia',
    position: 'Chairperson',
    role: 'Organiser',
    email: 'wtc@email.com',
    organisation: 'SUSS AI-IG',
    checkedIn: ref(false)
  }
]
</script>

<template>
  <div class="mx-auto max-w-2xl sm:px-6 lg:px-8">
    <label
      for="search"
      class="flex items-center justify-center text-lg font-medium leading-10 text-gray-900"
    >
      <MagnifyingGlassIcon class="h-6 mr-2" aria-hidden="true" />
      <span>Enter my information</span>
    </label>
    <div class="relative mt-2 rounded-xl shadow-sm">
      <input
        v-model="query"
        type="text"
        name="search"
        id="search"
        class="block w-full rounded-xl border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder=""
      />
      <button
        type="button"
        @click="erase"
        v-if="typing"
        class="group absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <XCircleIcon class="h-6 text-gray-400 group-hover:text-gray-400/70" aria-hidden="true" />
      </button>
    </div>
  </div>

  <div class="mx-auto max-w-2xl sm:px-6 lg:px-8 overflow-visible mt-6">
    <ul role="list" class="space-y-3 h-96 overflow-scroll">
      <li
        v-for="item in items"
        :key="item.id"
        class="rounded-2xl bg-white px-6 py-4 shadow border border-gray-300 space-y-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <span class="text-gray-900 font-bold">{{ item.name }}</span>
              <span class="text-gray-400 font-bold text-sm">{{ item.email }}</span>
            </div>
            <div class="flex flex-wrap text-normal gap-1">
              <span
                class="text-center rounded-md px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >{{ item.position }}</span
              >
              <span
                class="text-center rounded-md px-2 bg-yellow-50 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
                >{{ item.role }}</span
              >
              <span
                class="text-center rounded-md px-2 bg-gray-50 py-1 text-xs font-bold text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >{{ item.organisation }}</span
              >
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="checkIn(item)"
              :class="[
                'rounded-full px-2.5 py-1.5 text-sm font-medium shadow-sm transition border flex-none',
                item.checkedIn.value
                  ? 'bg-blue-100 border-blue-700/40 text-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-500 border-blue-600'
              ]"
            >
              <span v-if="!item.checkedIn.value" class="transition-all">Check In</span>
              <span v-else class="transition-all">Checked-in</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-full bg-yellow-300 px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:bg-yellow-200 border border-yellow-300"
            >
              <PrinterIcon class="w-5 mr-1" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
