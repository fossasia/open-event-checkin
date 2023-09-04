import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCameraStore = defineStore('camera', () => {
  const cameraSide = ref('front')
  const QRCodeValue = ref('')

  function $reset() {
    cameraSide.value = 'front'
    QRCodeValue.value = ''
  }

  function toggleCameraSide() {
    cameraSide.value = cameraSide.value === 'front' ? 'back' : 'front'
  }

  function paintOutline(detectedCodes, ctx) {
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

  async function logErrors(promise) {
    try {
      await promise
    } catch (error) {
      if (error.name === 'OverconstrainedError') {
        camera.value = 'auto'
      }
    }
  }

  return {
    cameraSide,
    QRCodeValue,
    $reset,
    toggleCameraSide,
    selected,
    logErrors
  }
})
