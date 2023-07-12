<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline'

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
  console.log(QRCodeValue)
}

const refreshComponent = () => {
  componentKey.value += 1
}

const updateShowNotification = (value) => {
  showNotification.value = value
}

const fireFunction = () => {
  // print user pass here
  console.log('Printing...')
}

const switchCamera = () => {
  camera.value = camera.value === 'front' ? 'rear' : 'front'
  refreshComponent()
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
  <div class="grow">
    <div class="py-2 space-y-3">
      <h2 class="text-center text-xl font-bold capitalize">{{ scannerType }} Scan</h2>
      <p class="text-center text-lg font-medium">Scan QR on badge</p>
    </div>
    <div class="w-full items-center flex justify-center">
      <div>
        <qrcode-stream
          :key="componentKey"
          class="!aspect-square !h-auto max-w-lg grid-cols-1 align-middle justify-center items-center"
          :track="selected.value"
          @init="logErrors"
          :camera="camera"
          @decode="decode"
        >
        </qrcode-stream>
        <button
          type="button"
          class="mt-4 inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="switchCamera"
        >
          <ArrowsRightLeftIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Switch Camera
        </button>
      </div>
    </div>
    <div class="text-green-500 font-bold mt-5 text-lg text-center" v-if="QRCodeValue != ''">
      { user name } has been checked into { room name }
    </div>
  </div>
</template>
