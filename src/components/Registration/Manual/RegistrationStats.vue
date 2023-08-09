<script setup>
const stationName = 'Station 1'

const stationStats = [
  { name: 'Check-In', stat: '71,897' },
  { name: 'Checkout', stat: '71,897' }
]

const overallStats = [
  { name: 'Check-In', stat: '71,897' },
  { name: 'Checkout', stat: '71,897' },
  { name: 'Registered', stat: '71,897' },
  { name: 'Not Checked In', stat: '71,897' }
]
</script>

<template>
  <div class="grow">
    <div class="py-2">
      <h2 class="text-center text-xl font-bold capitalize">Stats</h2>
    </div>
    <div class="space-y-5">
      <div>
        <h3 class="text-base font-semibold leading-6 text-body">Overall</h3>
        <dl class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div
            v-for="item in overallStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium bg-secondary">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-body">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <h3 class="text-base font-semibold leading-6 text-body">
          Station Total: {{ stationName }}
        </h3>
        <dl class="mt-5 grid grid-cols-2 gap-5">
          <div
            v-for="item in stationStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium bg-secondary">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-body">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
