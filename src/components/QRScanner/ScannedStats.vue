<script setup>
const sessionName = 'Session 1'
const trackName = 'Track 1'
const speakerName = ['Speaker 1', 'Speaker 2']
const stationName = 'Station 1'

const stationStats = [
  { name: 'Check-In', stat: '71,897' },
  { name: 'Checkout', stat: '71,897' }
]

const sessionStats = [
  { name: 'Check-In', stat: '71,897' },
  { name: 'Checkout', stat: '71,897' }
]

const trackStats = [
  { name: 'Check-In', stat: '71,897' },
  { name: 'Checkout', stat: '71,897' }
]
</script>

<template>
  <div>
    <div class="py-2 space-y-3">
      <h2 class="text-center text-xl font-bold capitalize">Stats</h2>
    </div>
    <div class="space-y-5">
      <div>
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Current Session: {{ sessionName }} by {{ speakerName }}
        </h3>
        <dl class="mt-5 grid grid-cols-2 gap-5">
          <div
            v-for="item in sessionStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium text-gray-500">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Current Track: {{ trackName }}
        </h3>
        <dl class="mt-5 grid grid-cols-2 gap-5">
          <div
            v-for="item in trackStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium text-gray-500">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Station Total: {{ stationName }}
        </h3>
        <dl class="mt-5 grid grid-cols-2 gap-5">
          <div
            v-for="item in stationStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium text-gray-500">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
