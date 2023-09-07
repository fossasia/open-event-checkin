<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useStatsStore } from '@/stores/stats'
import RefreshButton from '@/components/Utilities/RefreshButton.vue'

const loadingStore = useLoadingStore()
const statsStore = useStatsStore()
const route = useRoute()
const eventId = route.params.eventId

onMounted(async () => {
  await statsStore.getStats(eventId).then((res) => {
    overallStats.value[0][0].stat = res.total_attendee
    overallStats.value[0][1].stat = res.total_not_checked_in
    overallStats.value[0][2].stat = res.total_registered
    loadingStore.contentLoaded()
  })
})

const overallStats = ref([
  [
    { name: 'Total', stat: 0 },
    { name: 'Not Checked In', stat: 0 },
    { name: 'Registered', stat: 0 }
  ]
])
</script>

<template>
  <div class="grow">
    <div class="my-5 flex items-center justify-between">
      <h2>Stats</h2>
      <RefreshButton />
    </div>
    <div class="space-y-5">
      <div>
        <h3>Overall</h3>
        <dl
          v-for="(itemList, index) in overallStats"
          :key="index"
          class="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3"
        >
          <div
            v-for="item in itemList"
            :key="item.name"
            class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt class="truncate text-sm font-medium text-body">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-body-dark">
              {{ item.stat }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
