<script setup>
import { onBeforeMount, ref, nextTick } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import StandardButton from '@/components/Common/StandardButton.vue'
import { useCameraStore } from '@/stores/camera'
import RefreshButton from '@/components/Utilities/RefreshButton.vue'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'

const cameraStore = useCameraStore()

const emit = defineEmits(['scanned'])
const destroyed = ref(false)

// get list of camera devices of device and side
onBeforeMount(() => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      let environmentCameras = []
      devices.forEach((device) => {
          if(device.kind === 'videoinput') {
            const facingMode = device.getCapabilities().facingMode
            // const lbl = device.label
            const id = device.deviceId
            let obj = {}
            obj.id = id
            obj.facing = facingMode[0]
            cameraStore.cameraDevices.push(obj)

            if (facingMode[0] === 'environment') {
              environmentCameras.push(obj)
            }
          }
      });

      // select last of environment cameras
      if (environmentCameras.length > 0) {
        cameraStore.selectedCameraId.deviceId = environmentCameras[environmentCameras.length - 1].id
      } else {
        cameraStore.selectedCameraId.deviceId = cameraStore.cameraDevices[0].id
      }
      
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}
})

async function detectedQR([result]) {
  if (result) {
    // check if previous data is same
    if (cameraStore.qrCodeValue === result.rawValue) {
      return
    }
    cameraStore.qrCodeValue = result.rawValue
    emit('scanned')
  }
}

function switchCamera(){
  destroyed.value = true
  cameraStore.toggleCameraSide()
  nextTick(() => {
    destroyed.value = false
  })
}

</script>

// stop cam from processing if 7
<template>
  <qrcode-stream
    class="!aspect-square !h-auto max-w-sm"
    :paused="cameraStore.paused"
    :track="cameraStore.selected.value"
    :constraints="cameraStore.selectedCameraId"
    @error="cameraStore.logErrors"
    @detect="detectedQR"

    v-if="!destroyed" />
  <div class="space-x-3">
    <StandardButton
      :text="'Switch Camera'"
      :icon="ArrowsRightLeftIcon"
      class="mt-4 bg-primary"
      @click="switchCamera"
    />
    <RefreshButton class="mt-4" />
  </div>
</template>
