import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCameraStore = defineStore('camera', () => {
  const selectedCameraId = ref({
    deviceId: 'environment'
  })
  const cameraDevices = ref([])
  const paused = ref(false)
  const qrCodeValue = ref(null)

  function $reset() {
    selectedCameraId.value = {
      deviceId: 'environment'
    }
    paused.value = false
    cameraDevices.value = []
    qrCodeValue.value = null
  }

  function toggleCameraSide() {
    // get length of devices
    // if length is 1, then toggle is not possible
    const qty = cameraDevices.value
    if (qty === 1) {
      return
    }

    let index = cameraDevices.value.findIndex((device) => {
      return device.id === selectedCameraId.value.deviceId
    })

    // selected device is the next index
    const nextIndex = index + 1
    // if next index is the last index, then select the first index
    if (nextIndex === cameraDevices.value.length) {
      selectedCameraId.value.deviceId = cameraDevices.value[0].id
      return
    }
    // else select the next index
    selectedCameraId.value.deviceId = cameraDevices.value[nextIndex].id
  }

  function paintOutline(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
      qrCodeValue.value = detectedCode.rawValue
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

  function logErrors(error) {
    console.error(error)
    if (error.name === 'NotAllowedError') {
      console.error('You need to grant this page permission to access your camera and microphone.')
    }
  }

  return {
    selectedCameraId,
    paused,
    cameraDevices,
    qrCodeValue,
    $reset,
    toggleCameraSide,
    selected,
    logErrors
  }
})
