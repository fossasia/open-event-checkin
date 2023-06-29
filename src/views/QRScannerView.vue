<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'

import Notification from '../components/Notification.vue'

const camera = ref('rear')
const noFrontCamera = ref(false)
const noRearCamera = ref(false)
const errorText = ref('')
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

async function logErrors(promise) {
  // try {
  //   await promise
  // } catch (error) {
  //   const triedFrontCamera = camera.value === 'front'
  //   const triedRearCamera = camera.value === 'rear'

  //   const cameraMissingError = error.name === 'OverconstrainedError'

  //   if (triedRearCamera && cameraMissingError) {
  //     noRearCamera.value = true
  //   }

  //   if (triedFrontCamera && cameraMissingError) {
  //     noFrontCamera.value = true
  //   }
  // }
  try {
    await promise
  } catch (error) {
    if (error.name === 'OverconstrainedError') {
      errorText.value = error.name
      camera.value = "auto"
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-screen justify-center items-center">
    <Notification
      :showNotification="showNotification"
      :validQRCode="validQRCode"
      @update:show-modal="updateShowNotification"
      @fire-function="fireFunction"
    />
    <p>Error log: {{ errorText }}</p>
    <div class="w-full md:h-full items-center flex justify-center">
      <qrcode-stream
      :key="componentKey"
        class="w-full aspect-square p-4 sm:!w-3/4 sm:!p-0 md:!h-2/3 md:!w-auto"
        :track="selected.value"
        @init="logErrors"
        :camera="camera"
        @decode="decode"
      >
        <select v-model="camera" @change="refreshComponent" class="absolute top-0 right-0 m-4">
          <option value="front">Front</option>
          <option value="rear">Rear</option>
        </select>
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
