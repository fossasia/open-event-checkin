<script setup>
import { RouterView, useRoute } from 'vue-router'
import { CameraIcon, ChartBarIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const eventId = route.params.eventId

const tabs = [
  { name: 'Search', href: 'registerScan', icon: CameraIcon, current: true },
  { name: 'Hybrid', href: 'registerHybrid', icon: RocketLaunchIcon, current: false },
  { name: 'Stats', href: 'registerStats', icon: ChartBarIcon, current: false }
]
</script>
<template>
  <RouterView />
  <div class="mt-3">
    <p class="py-3">Go To:</p>
    <nav class="flex space-x-4" aria-label="Tabs">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.href, params: { eventId: eventId } }"
        :class="[
          tab.current ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
          'rounded-md px-3.5 py-2.5 text-sm font-medium inline-flex items-center'
        ]"
        :aria-current="tab.current ? 'page' : undefined"
      >
        <component :is="tab.icon" class="h-6 w-6 flex-none mr-2" aria-hidden="true" />
        {{ tab.name }}
      </RouterLink>
    </nav>
  </div>
</template>
