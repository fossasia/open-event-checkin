import { useAttendeesStore } from '@/stores/attendees'
import { useCameraStore } from '@/stores/camera'
import { useLoadingStore } from '@/stores/loading'
import extractVcardID from '@/utils/extractVcardID'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProcessCheckInStore = defineStore('processCheckIn', () => {
  const loadingStore = useLoadingStore()
  const cameraStore = useCameraStore()
  const attendeesStore = useAttendeesStore()

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

  async function checkInAttendeeScannerToRoom(microlocationId, scannerType) {
    const attendeeId = extractVcardID(cameraStore.qrCodeValue)
    if (!attendeeId) {
      message.value = 'Invalid QR Code'
      showErrorMsg()
      return
    }

    loadingStore.contentLoading()

    try {
      const checkedIn = await attendeesStore.checkInAttendee(attendeeId, microlocationId, scannerType)
      if (checkedIn) {
        message.value = 'Attendee ' + attendeeId + ' scan success.'
        showSuccessMsg()
      } else {
        message.value = 'Unknown error'
        showErrorMsg()
      }
      loadingStore.contentLoaded()
    } catch (error) {
      if (error === 'already done') {
        message.value = 'Attendee ' + attendeeId + ' already scanned.'
      } else {
        message.value = error
      }
      loadingStore.contentLoaded()
      showErrorMsg()
    }
  }

  return {
    response,
    $reset,
    checkInAttendeeScannerToRoom
  }
})
