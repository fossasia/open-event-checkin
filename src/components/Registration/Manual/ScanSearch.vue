<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import { useNotificationStore } from '@/stores/notification'
import PrintModal from '@/components/Modals/PrintModal.vue'
import SearchAttendee from '@/components/Registration/Manual/SearchAttendee.vue'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { useScannerStore } from '@/stores/scanner'
import { useSearchAttendeeStore } from '@/stores/searchAttendee'

const scannerStore = useScannerStore()
const notificationStore = useNotificationStore()

const searchAttendeeStore = useSearchAttendeeStore()

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType

const camera = ref('front')
const showPrintModal = ref(false)
const componentKey = ref(0)

const validQRCode = ref(true)

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
  <div
    class="grid grid-cols-1 gap-6 lg:gap-0 lg:grid-cols-2 w-full align-middle justify-center items-center place-items-center"
  >
    <div class="text-center mt-5">
      <h2 class="mb-3">Scan QR on Ticket</h2>
      <qrcode-stream
        class="!aspect-square !h-auto max-w-sm"
        :track="scannerStore.selected.value"
        :camera="camera"
        @init="logErrors"
        @decode="
          ;async () => {
            validQRCode = await scannerStore
              .checkInAttendeeScanner()
              .then(() => (showPrintModal = true))
          }
        "
      />
      <StandardButton
        :text="'Switch Camera'"
        :icon="ArrowsRightLeftIcon"
        class="bg-primary mt-4"
        @click="camera = camera === 'front' ? 'rear' : 'front'"
      />
    </div>
    <div class="w-full">
      <SearchAttendee @print="showPrintModal = true" />
    </div>
  </div>
  <PrintModal
    :key="componentKey"
    :show-print-modal="showPrintModal"
    :valid-q-r-code="validQRCode"
    @hide-modal="showPrintModal = false"
    @print="
      () => {
        notificationStore.addNotification(
          ['Successfully printed!', 'Please collect your ticket.'],
          'success'
        )
        // print user pass here
        console.log('Printing...')
        componentKey += 1 // refresh print modal
      }
    "
  />
</template>
