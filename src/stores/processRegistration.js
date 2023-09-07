import { useAttendeesStore } from '@/stores/attendees'
import { useCameraStore } from '@/stores/camera'
import { useLoadingStore } from '@/stores/loading'
import { useNotificationStore } from '@/stores/notification'
import { usePrintModalStore } from '@/stores/printModal'
import { useTicketsStore } from '@/stores/tickets'
import extractAttendeeId from '@/utils/extractAttendeeId'
import extractOrderId from '@/utils/extractOrderId'
import isValidTicketQR from '@/utils/isValidTicketQR'
import { defineStore } from 'pinia'

export const useProcessRegistrationStore = defineStore('processRegistration', () => {
  const loadingStore = useLoadingStore()
  const cameraStore = useCameraStore()
  const ticketsStore = useTicketsStore()
  const attendeesStore = useAttendeesStore()
  const notificationStore = useNotificationStore()
  const printModalStore = usePrintModalStore()

  async function processRegistrationCheckin(attendeeId, stationId) {
    try {
      const checkedIn = await attendeesStore.registerAttendee(attendeeId, stationId)
      if (checkedIn) {
        // update state of attendee if search is being used
        if (attendeesStore.attendees.length > 0) {
          const attendeeIndex = attendeesStore.attendees.findIndex((item) => item.id === attendeeId)
          if (attendeeIndex > -1) {
            attendeesStore.attendees[attendeeIndex].checkedIn = true
          }
        }
        // end
      } else {
        notificationStore.addNotification(['Error', 'Already checked in'], 'error')
      }
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async function registerAttendeeScanner(stationId) {
    if (!isValidTicketQR(cameraStore.qrCodeValue)) {
      notificationStore.addNotification(['Error', 'Invalid QR Code'], 'error')
      return
    }

    const attendeeId = extractAttendeeId(cameraStore.qrCodeValue)
    const orderId = extractOrderId(cameraStore.qrCodeValue)

    loadingStore.contentLoading()
    try {
      const attendee = await ticketsStore.getTicketAttendee(orderId)
      await processRegistrationCheckin(attendeeId, stationId)
      printModalStore.setPrintDetails(attendee.attributes['ticket-id'], attendeeId)
    } catch (error) {
      console.log(error)
      loadingStore.contentLoaded()
      notificationStore.addNotification(['Error', 'Unable to retrieve badge details'], 'error')
    }
  }

  return {
    processRegistrationCheckin,
    registerAttendeeScanner
  }
})
