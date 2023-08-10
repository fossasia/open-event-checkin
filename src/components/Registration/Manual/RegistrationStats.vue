<script setup>
import { useApiStore } from '@/stores/api'
import { useEventsStore } from '@/stores/events'
import { onMounted, ref } from 'vue'
const apiStore = useApiStore()
const eventsStore = useEventsStore()

async function getSessions() {
  const res = await apiStore.get(true, `events/${eventsStore.getEvent().id}/sessions`)
  console.log(res)
}

async function getStats() {
  const res = await apiStore.get(true, `user-check-in/stats/event/${eventsStore.getEvent().id}?session_ids=12`)
  overallStats.value[0].stat = res.total_attendee
  overallStats.value[1].stat = res.total_not_checked_in
  overallStats.value[2].stat = res.total_registered
  overallStats.value[3].stat = res.total_session_checked_in
  overallStats.value[4].stat = res.total_session_checked_out
  overallStats.value[5].stat = res.total_track_checked_in
  overallStats.value[5].stat = res.total_track_checked_out
  console.log(res)
}

onMounted(() => {
  getStats()
  getSessions()
})
const stationName = 'Station 1'

const stationStats = [
  { name: 'Check-In', stat: 0 },
  { name: 'Checkout', stat: 0 }
]

const overallStats = ref([
  { name: 'Total', stat: 0 },
  { name: 'Not Checked In', stat: 0 },
  { name: 'Registered', stat: 0 },
  { name: 'Session Checked-In', stat: 0 },
  { name: 'Session Checked-Out', stat: 0 },
  { name: 'Track Checked-In', stat: 0 },
  { name: 'Track Checked-Out', stat: 0 },
])
</script>

<template>
  <div class="grow">
    <div class="py-2">
      <h2 class="text-center text-xl font-bold capitalize">Stats</h2>
    </div>

    <div class="space-y-5">

      <div>
        <h3 class="text-base font-semibold leading-6 text-gray-900">Overall</h3>
        <dl class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div
            v-for="item in overallStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-300"
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
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-300"
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
