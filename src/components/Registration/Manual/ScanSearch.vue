<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'

import PrintModal from '@/components/Modals/PrintModal.vue'
import SearchAttendee from '@/components/Registration/Manual/SearchAttendee.vue'
import StandardButton from '@/components/Shared/StandardButton.vue'
import SuccessNotification from '@/components/Shared/SuccessNotification.vue'
import { useScannerStore } from '@/stores/scanner'
import { useSearchAttendeeStore } from '@/stores/searchAttendee'
import { usePrintModalStore } from '@/stores/printModal'

const scannerStore = useScannerStore()
const searchAttendeeStore = useSearchAttendeeStore()
const printModalStore = usePrintModalStore()

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType
const eventId = route.params.eventId

const camera = ref('front')
const showPrintModal = ref(false)
const showPrintedNotification = ref(false)
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
  <SuccessNotification
    :show-printed-notification="showPrintedNotification"
    :valid-q-r-code="validQRCode"
    @hidePrintedNotification="showPrintedNotification = false"
  />
  <div class="mx-auto grid grid-cols-1 xl:flex items-center gap-16 lg:w-3/4 h-full py-16">
    <PrintModal
      :key="componentKey"
      :show-print-modal="showPrintModal"
      :valid-q-r-code="validQRCode"
      @hideModal="showPrintModal = false"
      @print="
        () => {
          showPrintedNotification = true
          // print user pass here
          console.log('Printing...')
          componentKey += 1 // refresh print modal
        }
      "
    />
    <div class="xl:flex-none xl:w-96 flex flex-col items-start">
      <div class="w-full flex justify-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          Scan QR on Ticket
        </h2>
      </div>
      <div class="w-full">
        <div class="mx-auto w-fit">
          <qrcode-stream
            class="!aspect-square !h-auto max-w-lg grid-cols-1 align-middle justify-center items-center mt-2"
            :track="scannerStore.selected.value"
            :camera="camera"
            @init="logErrors"
            @decode="
              async () => {
                validQRCode = await scannerStore
                  .checkInAttendeeScanner()
                  .then(() => (showPrintModal = true))
              }
            "
          />
          <StandardButton
            text="Switch Camera"
            :icon="ArrowsRightLeftIcon"
            class="bg-blue-600 text-white hover:bg-blue-500 mt-4"
            @click="camera = camera === 'front' ? 'rear' : 'front'"
          />
        </div>
      </div>
      <div class="w-full"></div>
    </div>
    <div class="grow">
      <SearchAttendee @print="
        async ($event) => {
          await printModalStore.getBadgeFields($event)
          showPrintModal = true
        }" />
    </div>
  </div>
</template>
