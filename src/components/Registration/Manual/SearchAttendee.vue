<script setup>
import { ref } from 'vue'
import { XCircleIcon, PrinterIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { FunnelIcon } from '@heroicons/vue/24/outline'

// INITIALISE TEMPLATE REFS
const searchBar = ref(null)

const menuOpen = ref(false)
const query = ref('')

const items = [
  {
    id: 1,
    name: 'Wei Tat Chung',
    email: 'wtc@email.com',
    checkedIn: ref(false),
    info: {
      role: 'Chairperson',
      memberType: 'Organiser',
      organisation: 'SUSS AI-IG'
    }
  },
  {
    id: 2,
    name: 'Don Chia',
    email: 'wtc@email.com',
    checkedIn: ref(false),
    info: {
      role: 'Chairperson',
      memberType: 'Organiser',
      organisation: 'SUSS AI-IG'
    }
  },
  {
    id: 3,
    name: 'Shaun Ming Laclemence',
    email: 'wtc@email.com',
    checkedIn: ref(false),
    info: {
      role: 'Chairperson',
      memberType: 'Organiser',
      organisation: 'SUSS AI-IG'
    }
  },
  {
    id: 4,
    name: 'Very very very very very very very very very very long name',
    email: 'wtc@email.com',
    checkedIn: ref(false),
    info: {
      role: 'Chairperson',
      memberType: 'Organiser',
      organisation: 'SUSS AI-IG'
    }
  },
]

const filterOptions = [
  {
    id: 'filterRole',
    name: 'Role',
    show: ref(false)
  },
  {
    id: 'filterMem',
    name: 'Member type',
    show: ref(false)
  },
  {
    id: 'filterOrg',
    name: 'Organisation',
    show: ref(false)
  }
]
</script>

<template>
  <div v-if="menuOpen" @click="menuOpen = !menuOpen" class="fixed top-0 left-0 w-full h-full" />
  <div class="mx-auto w-full overflow-visible">
    <div>
      <div class="flex justify-center">
        <label for="search" class="text-2xl font-bold tracking-tight text-gray-900">
          Search by name or email
        </label>
      </div>

      <div class="mt-2">
        <div class="flex">
          <div class="flex flex-1 rounded-md shadow-sm">
            <div class="relative h-9 flex flex-grow items-stretch focus-within:z-10">
              <input
                v-model="query"
                type="text"
                name="search"
                id="search"
                class="group block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                @click="query = ''"
                v-if="query !== ''"
                class="group absolute inset-y-0 right-0 flex items-center pr-3 z-0"
              >
                <XCircleIcon
                  class="h-6 text-gray-400 group-hover:text-gray-400/70"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            @click="menuOpen = !menuOpen"
            :class="[
              menuOpen && 'bg-gray-50',
              'relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-1.5 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 group-focus:border-l-blue-600'
            ]"
          >
            <FunnelIcon v-if="!filterOptions.some((obj) => obj.show.value)" class="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="-ml-0.5 w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
                clip-rule="evenodd"
              />
            </svg>
            Filter
          </button>
        </div>

        <div class="flex justify-end">
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="menuOpen"
              class="w-40 absolute ring-1 ring-black/5 bg-white rounded-md pl-3 py-3 mt-2 space-y-3 shadow-lg"
            >
              <div
                v-for="(item, index) in filterOptions"
                :key="index"
                as="div"
                class="flex items-center"
              >
                <input
                  @click="item.show.value = !item.show.value"
                  type="checkbox"
                  :id="item.id"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  :checked="item.show.value"
                />
                <label :for="item.id" class="ml-3 text-sm leading-6 font-medium text-gray-900">{{
                  item.name
                }}</label>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div v-if="items.length > 0" class="mt-5 h-96 overflow-scroll">
      <ul role="list" class="flex flex-col gap-3">
        <li
          v-for="item in items"
          :key="item.id"
          class="rounded-md bg-white px-6 py-4 shadow border border-gray-300 last:mb-1"
        >
          <div class="flex items-center justify-between gap-8">
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1">
                <span class="text-gray-900 font-bold">{{ item.name }}</span>
                <span class="text-gray-400 font-bold text-sm">{{ item.email }}</span>
              </div>
              <div
                v-if="filterOptions.some((obj) => obj.show.value)"
                class="flex flex-wrap text-normal gap-1"
              >
                <span
                  v-if="filterOptions[0].show.value"
                  class="text-center rounded-md px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >{{ item.info.role }}</span
                >
                <span
                  v-if="filterOptions[1].show.value"
                  class="text-center rounded-md px-2 bg-yellow-50 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
                  >{{ item.info.memberType }}</span
                >
                <span
                  v-if="filterOptions[2].show.value"
                  class="text-center rounded-md px-2 bg-gray-50 py-1 text-xs font-bold text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >{{ item.info.organisation }}</span
                >
              </div>
            </div>

            <div class="flex items-center gap-2 flex-none">
              <button
                type="button"
                @click="item.checkedIn.value = true"
                :class="[
                  'rounded-md px-2.5 py-2 text-sm font-medium shadow-sm transition',
                  item.checkedIn.value
                    ? 'bg-blue-600/20 text-blue-700/70'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                ]"
              >
                <span v-if="!item.checkedIn.value" class="transition-all">Check In</span>
                <span v-else class="transition-all">Checked-in</span>
              </button>
              <button
                type="button"
                class="inline-flex items-center rounded-md bg-yellow-300 px-2.5 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-200"
              >
                <PrinterIcon class="w-5 mr-1" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="mt-5 h-96 rounded-lg bg-gray-50 border border-gray-300 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <MagnifyingGlassIcon class="h-12 text-gray-300" />
        <span class="text-2xl font-bold text-gray-300">No Search Results</span>
      </div>
    </div>
  </div>
</template>
