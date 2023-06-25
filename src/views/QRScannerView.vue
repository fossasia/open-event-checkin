<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'

import Notification from '../components/Notification.vue'

const camera = ref('front')
const QRCodeValue = ref('')

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

const showNotification = ref(false)

const updateShowNotification = (value) => {
  showNotification.value = value
}

const fireFunction = () => {
  // print user pass here
  console.log('Printing...')
}

const logErrors = (promise) => {
  promise.catch(console.error)
}

const validQRCode = ref(true)

const decode = () => {
      // check if QRCodeValue is valid and conforms to what is needed over here

  showNotification.value = true
  console.log(QRCodeValue)
}
</script>

<template>
  <div class="flex h-screen justify-center items-center">
    <Notification
      :showNotification="showNotification"
      :validQRCode="validQRCode"
      @update:show-modal="updateShowNotification"
      @fire-function="fireFunction"
    />
    <div class="w-full md:h-full items-center flex justify-center">
        <qrcode-stream
        class="w-full aspect-square p-4 sm:!w-3/4 sm:!p-0 md:!h-2/3 md:!w-auto"
        :track="selected.value"
        @init="logErrors"
        :camera="camera"
        @decode="decode"
        >
        </qrcode-stream>
    </div>
  </div>
</template>

<style scoped>
button {
  position: absolute;
  left: 10px;
  top: 10px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
