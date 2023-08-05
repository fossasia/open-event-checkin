<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import { useApiStore } from '@/stores/api'
import { useTypeSelectorStore } from '@/stores/typeSelector'
import { useEventsStore } from '@/stores/events'
import PasswordModal from '@/components/Modals/PasswordModal.vue'

const route = useRoute()
const router = useRouter()
const apiStore = useApiStore()
const typeSelectorStore = useTypeSelectorStore()
const eventsStore = useEventsStore()
const userName = ref('')

onMounted(() => {
  if (route.params.eventId && route.params.stationId) {
    eventsStore.getEvents()
    typeSelectorStore.getStations(route.params.eventId)
  }

  // get user name
  apiStore
    .get(true, 'users/user-details/get-user-id') // get user id
    .then(async (res) => {
      apiStore.get(true, `/users/${res.user_id}`).then((response) => {
        // get name
        userName.value = response.data.attributes['first-name']
      })
    })
    .catch((err) => {
      // if error, kick user to login page
      router.replace({
        name: 'userAuth'
      })
    })
})

const navbarTitle = computed(() => {
  // check if event id and station id exist in url params
  if (route.params.eventId && route.params.stationId) {
    // find the event
    const event = eventsStore.userEvents.find((event) => event.id === route.params.eventId)
    // find station name
    const station = typeSelectorStore.eventStations.find(
      (station) => station.id === parseInt(route.params.stationId)
    )
    if (!event || !station) {
      return ''
    }
    return `${event.name} - ${station.attributes['station-name']}`
  }
  return ''
})

const navigation = [
  { name: 'Main', href: '#', current: true, icon: HomeIcon },
  { name: 'Statistics', href: '#', current: false, icon: ChartBarIcon },
  { name: 'Close', href: '#', current: false, icon: XMarkIcon }
]
const userNavigation = computed(() => {
  if (route.params.registrationType) {
    return [
      { name: 'Stats', action: () => router.push({ name: 'registerStats' }) },
      { name: 'Sign out', action: () => (showPasswordModal.value = true) }
    ]
  } else if (route.params.scannerType) {
    return [
      { name: 'Stats', action: () => router.push({ name: 'scannerStats' }) },
      { name: 'Sign out', action: () => (showPasswordModal.value = true) }
    ]
  } else {
    return [{ name: 'Sign out', action: () => (showPasswordModal.value = true) }]
  }
})
const showNavigation = ref(false)
const showPasswordModal = ref(false)
const componentKey = ref(0)
</script>

<template>
  <PasswordModal
    :key="componentKey"
    :show-password-modal="showPasswordModal"
    @hide-password-modal="
      ($event) => {
        showPasswordModal = $event
        componentKey += 1
      }
    "
  />
  <Disclosure v-slot="{ open }" as="header" class="bg-white shadow sticky top-0 z-20">
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <div class="relative flex h-16 justify-between space-x-5">
        <div class="relative z-10 flex pl-2">
          <div class="flex flex-shrink-0 items-center">Eventyay</div>
        </div>
        <div
          class="z-0 flex flex-1 items-center justify-center max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-3xl"
        >
          <p class="font-bold text-xl truncate">{{ navbarTitle }}</p>
        </div>
        <div class="relative z-10 flex items-center lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Open menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-4 flex-shrink-0">
            <div>
              <MenuButton
                class="flex items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Open user menu</span>
                <ChevronDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-for="item in userNavigation" :key="item.name">
                  <button
                    :class="[
                      item.name === 'Sign out'
                        ? 'text-red-600 hover:bg-red-100 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100',
                      'w-full text-left px-4 py-2 text-sm'
                    ]"
                    @click="item.action"
                  >
                    <component
                      :is="item.icon"
                      class="h-6 w-6 flex-none text-gray-400 mr-2"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
      <nav v-if="showNavigation" class="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
            'inline-flex items-center rounded-md py-2 px-3 text-sm font-medium'
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          <component
            :is="item.icon"
            class="h-6 w-6 flex-none text-gray-400 mr-2"
            aria-hidden="true"
          />
          {{ item.name }}
        </a>
      </nav>
    </div>

    <DisclosurePanel as="nav" class="lg:hidden" aria-label="Global">
      <div v-if="showNavigation" class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
            'block rounded-md py-2 px-3 text-base font-medium'
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton
        >
      </div>
      <div class="border-t border-gray-200 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="text-base font-medium text-gray-800">Logged in as: {{ userName }}</div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            v-for="item in userNavigation"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[
              item.name === 'Sign out'
                ? 'text-red-600 hover:bg-red-100 font-semibold'
                : 'text-gray-700 hover:bg-gray-100',
              'block rounded-md px-3 py-2 text-base cursor-pointer'
            ]"
            @click="item.action"
          >
            {{ item.name }}
          </DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
