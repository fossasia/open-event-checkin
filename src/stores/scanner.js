import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useScannerStore = defineStore('scanner', () => {
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

  function isValidQRCode(str) {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    return uuidRegex.test(str)
  }

  function stringModifier(str) {
    const parts = str.split('-')
    parts.pop() // Remove the last part (e.g., '-902', '-82', etc.)
    return parts.join('-')
  }

  function extractId(str) {
    const regex = /-(\d+)$/
    const match = str.match(regex)
    return match ? parseInt(match[1], 10) : null
  }

  return { QRCodeValue, selected, paintOutline, isValidQRCode, stringModifier, extractId }
})
