<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { useQRScannerStore } from '@/stores/qrScanner'

const qrScannerStore = useQRScannerStore()

// get scanner type from vue router params
const route = useRoute()
const scannerType = route.params.scannerType

const camera = ref('front')
const validQRCode = ref(true)

const name = ref('')

const decode = () => {
  // check if QRCodeValue is valid and conforms to what is needed over here
  const validQR = qrScannerStore.isValidQRCode(qrScannerStore.stringModifier(qrScannerStore.QRCodeValue))
  validQRCode.value = validQR
  if (validQR) {
    console.log('checkin attendee', qrScannerStore.extractId(qrScannerStore.QRCodeValue)) // checks in to room
    name.value = qrScannerStore.getAttendeeName(qrScannerStore.extractId(qrScannerStore.QRCodeValue))
  }
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
          class="!aspect-square !h-auto max-w-lg grid-cols-1 align-middle justify-center items-center"
          :track="selected.value"
          :camera="camera"
          @init="logErrors"
          @decode="decode"
        >
        </qrcode-stream>
        <StandardButton
          text="Switch Camera"
          :icon="ArrowsRightLeftIcon"
          class="bg-blue-600 text-white hover:bg-blue-500 mt-4"
          @click="camera = camera === 'front' ? 'rear' : 'front'"
        />
      </div>
    </div>
    <div v-if="qrScannerStore.QRCodeValue != ''" class="text-green-500 font-bold mt-5 text-lg text-center">
      {{ name }} has been checked into {{  }}
    </div>
  </div>
</template>
