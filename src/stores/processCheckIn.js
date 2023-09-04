import { useAttendeesStore } from '@/stores/attendees'
import { useCameraStore } from '@/stores/camera'
import { useLoadingStore } from '@/stores/loading'
import { useTicketsStore } from '@/stores/tickets'
import extractOrderId from '@/utils/extractOrderId'
import isValidTicketQR from '@/utils/isValidTicketQR'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProcessCheckInStore = defineStore('processCheckIn', () => {
  const loadingStore = useLoadingStore()
  const cameraStore = useCameraStore()
  const attendeesStore = useAttendeesStore()
  const ticketsStore = useTicketsStore()

  const message = ref('')
  const showSuccess = ref(false)
  const showError = ref(false)

  function $reset() {
    message.value = ''
    showSuccess.value = false
    showError.value = false
  }

  const response = computed(() => {
    let classType = ''
    if (showSuccess.value) {
      classType = 'text-success'
    }
    if (showError.value) {
      classType = 'text-danger'
    }
    return {
      message: message.value,
      class: classType
    }
  })

  function showErrorMsg() {
    showSuccess.value = false
    showError.value = true
  }

  function showSuccessMsg() {
    showSuccess.value = true
    showError.value = false
  }

  async function checkInAttendeeScannerToRoom(microlocationId) {
    if (!isValidTicketQR(cameraStore.QRCodeValue)) {
      message.value = 'Invalid QR Code'
      showErrorMsg()
      return
    }

    const orderId = extractOrderId(cameraStore.QRCodeValue)
    loadingStore.contentLoading()

    try {
      const attendee = await ticketsStore.getTicketAttendee(orderId)
      const checkedIn = await attendeesStore.checkInAttendee(attendee.id, microlocationId)
      if (checkedIn) {
        message.value = 'Checked in: ' + name
        showSuccessMsg()
      } else {
        message.value = name + ' already checked in.'
        showErrorMsg()
      }
      loadingStore.contentLoaded()
    } catch (error) {
      loadingStore.contentLoaded()
      message.value = error
      showErrorMsg()
    }
  }

  return {
    response,
    $reset,
    checkInAttendeeScannerToRoom
  }
})
