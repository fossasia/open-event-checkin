<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'

import PrintModal from '@/components/Modals/PrintModal.vue'
import StandardButton from '@/components/Shared/StandardButton.vue'
import SuccessNotification from '@/components/Shared/SuccessNotification.vue'

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType

const camera = ref('front')
const QRCodeValue = ref('')
const showPrintModal = ref(false)
const showPrintedNotification = ref(false)
const componentKey = ref(0)

const paintOutline = (detectedCodes, ctx) => {
  for (const detectedCode of detectedCodes) {
    QRCodeValue.value = detectedCode.rawValue
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints
    ctx.strokeStyle = 'red'
    ctx.strokeWidth = 5

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

const selected = {
  text: 'outline',
  value: paintOutline
}

const validQRCode = ref(true)

const decode = () => {
  // check if QRCodeValue is valid and conforms to what is needed over here
  showPrintModal.value = true
  console.log(QRCodeValue)
}

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
    :showPrintedNotification="showPrintedNotification"
    :validQRCode="validQRCode"
    @hidePrintedNotification="showPrintedNotification = false"
  />
  <div class="h-full mx-auto max-w-7xl flex">
    <PrintModal
      :key="componentKey"
      :showPrintModal="showPrintModal"
      :validQRCode="validQRCode"
      @hideModal="showPrintModal = false"
      @print="
        () => {
          showPrintedNotification = true
          // print user pass here
          console.log('Printing...')
          componentKey += 1
        }
      "
    />
    <div
      class="grid grid-cols-1 h-3/4 lg:h-auto gap-12 lg:gap-0 lg:grid-cols-2 w-full align-middle justify-center items-center place-items-center"
    >
      <div>
        <qrcode-stream
          class="!aspect-square !h-auto max-w-lg grid-cols-1 align-middle justify-center items-center"
          :track="selected.value"
          @init="logErrors"
          :camera="camera"
          @decode="decode"
        >
        </qrcode-stream>
        <StandardButton
          @click="camera = camera === 'front' ? 'rear' : 'front'"
          text="Switch Camera"
          :icon="ArrowsRightLeftIcon"
          class="bg-blue-600 text-white hover:bg-blue-500 mt-4"
        />
      </div>
      <div class="w-full flex-auto text-center grid-cols-1">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Scan QR on Ticket
        </h2>
        <p class="mt-6 text-lg leading-8 text-gray-500">Kindly wait for your badge to print</p>
      </div>
    </div>
  </div>
</template>
