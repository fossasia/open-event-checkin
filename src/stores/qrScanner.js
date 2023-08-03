import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import { useScannerStore } from '@/stores/scanner'

export const useQRScannerStore = defineStore('qrScanner', () => {
  const QRCodeValue = ref('')
  const name = ref('')
  const errorString = ref('')

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

  async function checkInAttendeeToRoom(attendeeId, stationId, eventId) {
    try {
      const stations = await useApiStore().get(true, `events/${eventId}/stations`)
      const sessions = await useApiStore().get(true, `events/${eventId}/sessions`)
      const station = stations.data.find((station) => station.id == stationId)
      const payload = {
        data: {
          relationships: {
            station: {
              data: {
                type: station.type,
                id: 10 + ''
              }
            },
            session: {
              data: {
                type: sessions.data[0].type,
                id: sessions.data[0].id + ''
              }
            },
            ticket_holder: {
              data: {
                type: 'attendee',
                id: attendeeId + ''
              }
            }
          },
          type: 'user_check_in'
        }
      }
      const checkInRes = await useApiStore().post(true, 'user-check-in', payload, false)
      console.log('check in success to room:', checkInRes)
      name.value = await getAttendeeName(attendeeId) // assign attendee name
    } catch (error) {
      const errors = error.originalError.body.errors
      if (errors.find((error) => error.detail === 'Attendee already checked in.')) {
        errorString.value = (await getAttendeeName(attendeeId)) + ' already checked in' // set error message to show user
        setTimeout(() => (errorString.value = ''), 3000)
        throw new Error('Already checked in')
      }
    }
  }

  async function checkInAttendeeScannerToRoom(stationId, eventId) {
    if (useScannerStore().isValidQRCode(useScannerStore().stringModifier(QRCodeValue.value))) {
      try {
        await checkInAttendeeToRoom(
          useScannerStore().extractId(QRCodeValue.value),
          stationId,
          eventId
        )
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    } else {
      errorString.value = 'Invalid QR code'
      setTimeout(() => (errorString.value = ''), 3000)
      return false
    }
  }

  async function getAttendeeName(attendeeId) {
    try {
      const attendee = await useApiStore().get(true, `attendees/${attendeeId}`)
      return attendee.data.attributes['firstname'] + ' ' + attendee.data.attributes['lastname']
    } catch (error) {
      console.error(error)
      return 'Attendee ' + attendeeId
    }
  }

  return {
    QRCodeValue,
    name,
    errorString,
    selected,
    paintOutline,
    checkInAttendeeToRoom,
    checkInAttendeeScannerToRoom
  }
})
