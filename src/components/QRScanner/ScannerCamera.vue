<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { useQRScannerStore } from '@/stores/qrScanner'
import { useTypeSelectorStore } from '@/stores/typeSelector'

const qrScannerStore = useQRScannerStore()
const typeSelectorStore = useTypeSelectorStore()

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType
const stationId = route.params.stationId
const eventId = route.params.eventId

const camera = ref('front')

const showMessage = ref(false)

const stationName = computed(() => {
  const station = typeSelectorStore.eventStations.find(
    (station) => station.id === parseInt(stationId)
  )
  return station.attributes['station-name']
})

async function logErrors(promise) {
  try {
    await promise
  } catch (error) {
    if (error.name === 'OverconstrainedError') {
      camera.value = 'auto'
    }
  }
}
</script>

<template>
  <div class="grow">
    <div class="py-2 space-y-3">
      <h2 class="text-center">{{ scannerType }} Scan</h2>
      <p class="text-center text-lg font-medium">Scan QR on badge</p>
    </div>
    <div class="w-full items-center flex justify-center">
      <div>
        <qrcode-stream
          class="!aspect-square !h-auto max-w-lg grid-cols-1 align-middle justify-center items-center"
          :track="qrScannerStore.selected.value"
          :camera="camera"
          @init="logErrors"
          @decode="
            async () => {
              showMessage = await qrScannerStore.checkInAttendeeScannerToRoom(stationId, eventId)
            }
          "
        >
        </qrcode-stream>
        <StandardButton
          text="Switch Camera"
          :icon="ArrowsRightLeftIcon"
          class="bg-primary hover:bg-blue-500 mt-4"
          @click="camera = camera === 'front' ? 'rear' : 'front'"
        />
      </div>
    </div>
    <p class="text-bold mt-5 text-lg text-center">
      <span v-if="showMessage" class="text-success"
        >{{ qrScannerStore.name }} has been checked into {{ stationName }}</span
      >
      <span v-else class="text-danger">{{ qrScannerStore.errorString }} </span>
    </p>
  </div>
</template>
