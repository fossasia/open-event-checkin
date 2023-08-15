<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import PrintModal from '@/components/Modals/PrintModal.vue'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { useScannerStore } from '@/stores/scanner'
import { usePrintModalStore } from '@/stores/printModal'

const scannerStore = useScannerStore()
const printModalStore = usePrintModalStore()

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType
const stationId = route.params.stationId

const camera = ref('front')

async function logErrors(promise) {
  try {
    await promise
  } catch (error) {
    if (error.name === 'OverconstrainedError') {
      camera.value = 'auto'
    }
  }
}

async function decodeQR() {
  await scannerStore.checkInAttendeeScanner(stationId).then(() => {
    printModalStore.showPrintModal = true
  })
}
</script>

<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-2 w-full align-middle justify-center items-center place-items-center h-screen -mt-16"
  >
    <!-- padding to counter camera in mobile view -->
    <div class="text-center pt-24">
      <qrcode-stream
        class="!aspect-square !h-auto max-w-sm"
        :track="scannerStore.selected.value"
        :camera="camera"
        @init="logErrors"
        @decode="decodeQR"
      >
      </qrcode-stream>
      <StandardButton
        :text="'Switch Camera'"
        :icon="ArrowsRightLeftIcon"
        class="bg-primary mt-4"
        @click="camera = camera === 'front' ? 'rear' : 'front'"
      />
    </div>
    <div class="w-full text-center">
      <h2>Scan QR on Ticket</h2>
      <p class="my-6 text-lg leading-8">Kindly wait for your badge to print</p>
    </div>
  </div>
  <PrintModal />
</template>
