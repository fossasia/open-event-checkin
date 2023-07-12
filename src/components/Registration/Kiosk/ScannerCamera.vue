<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import PrintModal from '@/components/Modals/PrintModal.vue'

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType

const camera = ref('front')
const QRCodeValue = ref('')
const showNotification = ref(false)
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
  showNotification.value = true
  console.log(QRCodeValue)
}

// const refreshComponent = () => {
//   componentKey.value += 1
// }

const updateShowNotification = (value) => {
  showNotification.value = value
}

const fireFunction = () => {
  // print user pass here
  console.log('Printing...')
  // refreshComponent()
}

const switchCamera = () => {
  camera.value = camera.value === 'front' ? 'rear' : 'front'
  // refreshComponent()
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
  <div class="h-full mx-auto max-w-7xl flex">
    <PrintModal
      :showNotification="showNotification"
      :validQRCode="validQRCode"
      @update:show-modal="updateShowNotification"
      @fire-function="fireFunction"
    />
    <div
      class="grid grid-cols-1 lg:grid-cols-2 w-full align-middle justify-center items-center place-items-center"
    >
      <qrcode-stream
        :key="componentKey"
        class="!aspect-square !h-auto max-w-lg grid-cols-1 align-middle justify-center items-center"
        :track="selected.value"
        @init="logErrors"
        :camera="camera"
        @decode="decode"
      >
        <button
          type="button"
          class="rounded fixed m-4 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="switchCamera"
        >
          Switch Camera
        </button>
      </qrcode-stream>
      <div class="w-full flex-auto text-center grid-cols-1">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Scan QR on Ticket
        </h2>
        <p class="mt-6 text-lg leading-8 text-gray-500">Kindly wait for your badge to print</p>
      </div>
    </div>
  </div>
</template>
