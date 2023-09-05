<script setup>
import { ref, onBeforeMount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useLoadingStore } from '@/stores/loading'
import { useNavbarStore } from '@/stores/navbar'
import { useUserStore } from '@/stores/user'
import PasswordModal from '@/components/Modals/PasswordModal.vue'

const router = useRouter()
const loadingStore = useLoadingStore()
const navbarStore = useNavbarStore()
const userStore = useUserStore()

loadingStore.navbarLoading()

onBeforeMount(async () => {
  // this is for if loading the page directly
  // check if user details is empty
  if (!userStore.userDetails) {
    await userStore.getUserDetails().catch((err) => {
      // if error, kick user to login page
      router.replace({
        name: 'userAuth'
      })
    })
  }
  nextTick(() => {
    loadingStore.navbarLoaded()
  })
})
</script>

<template>
  <Disclosure v-slot="{ open }" as="header" class="sticky top-0 z-10 bg-white shadow">
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-secondary-light lg:px-8">
      <div class="flex h-16 items-center justify-between space-x-5">
        <div>
          <div>Eventyay</div>
          <div v-if="navbarStore.navbarTitle" class="w-60 sm:w-96">
            <p class="truncate text-ellipsis text-lg">{{ navbarStore.navbarTitle }}</p>
          </div>
        </div>
        <div v-if="navbarStore.loadMenu" class="relative flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-body hover:bg-body-light"
          >
            <span class="sr-only">Open menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div v-if="navbarStore.loadMenu" class="hidden lg:ml-4 lg:block">
          <template v-for="item in navbarStore.stationNavigation" :key="item.name">
            <button :class="[item.customClass, 'px-4 py-2 text-sm']" @click="item.action">
              <component :is="item.icon" class="mr-2 inline-block h-6 w-6" aria-hidden="true" />
              {{ item.name }}
            </button>
          </template>
          <template v-for="item in navbarStore.publicNavigation" :key="item.name">
            <button :class="[item.customClass, 'px-4 py-2 text-sm']" @click="item.action">
              <component :is="item.icon" class="mr-2 inline-block h-6 w-6" aria-hidden="true" />
              {{ item.name }}
            </button>
          </template>
          <span class="ml-2 text-sm">Logged in as: {{ userStore.userName }}</span>
        </div>
      </div>
    </div>

    <DisclosurePanel v-if="navbarStore.loadMenu" as="nav" class="lg:hidden" aria-label="Global">
      <div class="border-t border-secondary-light pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="text-base font-medium">Logged in as: {{ userName }}</div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            v-for="item in navbarStore.stationNavigation"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[
              item.customClass,
              'block cursor-pointer rounded-md px-3 py-2 text-base transition'
            ]"
            @click="item.action"
          >
            <component :is="item.icon" class="mr-2 inline-block h-6 w-6" aria-hidden="true" />
            {{ item.name }}
          </DisclosureButton>
          <DisclosureButton
            v-for="item in navbarStore.publicNavigation"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[
              item.customClass,
              'block cursor-pointer rounded-md px-3 py-2 text-base transition'
            ]"
            @click="item.action"
          >
            <component :is="item.icon" class="mr-2 inline-block h-6 w-6" aria-hidden="true" />
            {{ item.name }}
          </DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>

  <PasswordModal />
</template>
