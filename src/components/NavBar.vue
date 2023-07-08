<script setup>
import { ref, watch } from 'vue'
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
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import PasswordNotificationModal from '@/components/Modals/PasswordNotificationModal.vue'

const user = {
  name: 'Tom Cook',
  icon: UserCircleIcon
}

const showNavigation = ref(false)
const showPasswordNotification = ref(false)
const validPassword = ref(null)
const passwordField = ref('')

const checkPassword = (value) => {
  // check password here
  if (value === '1234') {
    validPassword.value = true
    showPasswordNotification.value = false
    // sign out
  } else {
    validPassword.value = false
  }
}

watch(
  () => passwordField.value,
  (value) => {
    checkPassword(value)
  }
)

const navigation = [
  { name: 'Main', href: '#', current: true, icon: HomeIcon },
  { name: 'Statistics', href: '#', current: false, icon: ChartBarIcon },
  { name: 'Close', href: '#', current: false, icon: XMarkIcon }
]
const userNavigation = [{ name: 'Sign out', action: () => (showPasswordNotification.value = true) }]

const eventName = ref('test event')
</script>

<template>
  <password-notification-modal
    :showNotification="showPasswordNotification"
    :validPassword="validPassword"
    @update:show-modal="showPasswordNotification = $event"
    @emit-password="passwordField = $event"
  />
  <Disclosure as="header" class="bg-white shadow sticky top-0" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <div class="relative flex h-16 justify-between space-x-5">
        <div class="relative z-10 flex pl-2">
          <div class="flex flex-shrink-0 items-center">Eventyay</div>
        </div>
        <div
          class="z-0 flex flex-1 items-center justify-center max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-3xl"
        >
          <p class="font-bold text-xl truncate">{{ eventName }}</p>
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
                <component :is="user.icon" class="h-8 w-8 text-gray-400" aria-hidden="true" />
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
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-for="item in userNavigation" :key="item.name">
                  <button
                    @click="item.action"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <component :is="user.icon" class="h-10 w-10 text-gray-400 mr-2" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            v-for="item in userNavigation"
            :key="item.name"
            as="a"
            :href="item.href"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >{{ item.name }}</DisclosureButton
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
