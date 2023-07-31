import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'

export const useQRScannerStore = defineStore('qrScanner', () => {
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

  async function checkInAttendeeToRoom(id) {
    var attendeeRes = null
    await useApiStore()
      .get(true, `attendees/${id}`)
      .then((res) => {
        attendeeRes = res.data.attributes
        attendee
      })

    const payload = {
      data: {
        attributes: {
          'is-checked-in': 'true',
          'checkin-times': getCurrentISO8601DateTime(),
          'attendee-notes': null,
          pdf_url: attendeeRes['pdf-url']
        },
        type: 'attendee',
        id: `${id}`
      }
    }
    await useApiStore()
      .patch(`attendees/${id}`, payload)
      .then((res) => console.log(res.data.attributes))
  }

  async function getAttendeeName(id) {
    await useApiStore()
      .get(true, `attendees/${id}`)
      .then((res) => {
        return res.data.attributes['firstname'] + ' ' + res.data.attributes['lastname']
      })
  }

  return { QRCodeValue, selected, paintOutline, isValidQRCode, stringModifier, extractId, checkInAttendeeToRoom, getAttendeeName }
})
