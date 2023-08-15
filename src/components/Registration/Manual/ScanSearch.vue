<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import SearchAttendee from '@/components/Registration/Manual/SearchAttendee.vue'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { useScannerStore } from '@/stores/scanner'
import { usePrintModalStore } from '@/stores/printModal'
import { useNotificationStore } from '@/stores/notification'

const scannerStore = useScannerStore()
const printModalStore = usePrintModalStore()
const notificationStore = useNotificationStore()
// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType
const eventId = route.params.eventId

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
  await scannerStore.checkInAttendeeScanner().then(() => printModalStore.value = true).catch(() => notificationStore.addNotification({ type: 'error', message: 'Attendee not found' }))
}
</script>

<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-2 w-full align-middle justify-center items-center place-items-center h-screen -mt-16"
  >
    <div class="text-center pt-24">
      <h2 class="mb-3">Scan QR on Ticket</h2>
      <qrcode-stream
        class="!aspect-square !h-auto max-w-sm"
        :track="scannerStore.selected.value"
        :camera="camera"
        @init="logErrors"
        @decode="decodeQR"
      />
      <StandardButton
        :text="'Switch Camera'"
        :icon="ArrowsRightLeftIcon"
        class="bg-primary mt-4"
        @click="camera = camera === 'front' ? 'rear' : 'front'"
      />
    </div>
    <div class="w-full h-full py-24">
      <h2 class="mb-3 text-center">Search by name or email</h2>
      <SearchAttendee @print="printModalStore.showPrintModal = true" />
    </div>
  </div>
</template>
