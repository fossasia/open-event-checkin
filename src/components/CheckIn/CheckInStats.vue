<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useSessionsStore } from '@/stores/sessions'
import { useStatsStore } from '@/stores/stats'
import RefreshButton from '@/components/Utilities/RefreshButton.vue'

const loadingStore = useLoadingStore()
const statsStore = useStatsStore()
const sessionsStore = useSessionsStore()
const route = useRoute()
const eventId = route.params.eventId
const scannerType = route.params.scannerType
const microlocationId = route.params.stationId

const sessionStats = ref([
  { name: 'Check-In', stat: '0' },
  { name: 'Checkout', stat: '0' }
])

const trackStats = ref([
  { name: 'Check-In', stat: '0' },
  { name: 'Checkout', stat: '0' }
])

const trackName = ref('')

onBeforeMount(async () => {
  // check for location then pass to get curent sessions
  await sessionsStore.getCurrentSession(microlocationId).then(async (res) => {
    if (res === undefined) {
      trackName.value = 'No Track'
      loadingStore.contentLoaded()
      return
    }

    await statsStore.getStats(eventId, res.id).then((r) => {
      trackName.value = r.session_stats[0].track_name
      sessionStats.value[0].stat = r.total_session_checked_in
      sessionStats.value[1].stat = r.total_session_checked_out
      trackStats.value[0].stat = r.total_track_checked_in
      trackStats.value[1].stat = r.total_track_checked_out
      loadingStore.contentLoaded()
    })
  })
})
</script>

<template>
  <div class="grow">
    <div class="my-5 flex items-center justify-between">
      <h2>Stats</h2>
      <RefreshButton />
    </div>
    <div v-if="scannerType !== 'daily'" class="space-y-5">
      <div>
        <h3 class="text-base font-semibold leading-6 text-body">
          Current Session: {{ sessionsStore.currentSessionName }}
        </h3>
        <dl class="mt-5 grid grid-cols-2 gap-5">
          <div
            v-for="item in sessionStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-body">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <h3 class="text-base font-semibold leading-6 text-body">Current Track: {{ trackName }}</h3>
        <dl class="mt-5 grid grid-cols-2 gap-5">
          <div
            v-for="item in trackStats"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-base font-medium">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-body">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div v-else>
      Work in progress
    </div>
  </div>
</template>
