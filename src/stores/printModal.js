import { useApiStore } from '@/stores/api'
import { useLoadingStore } from '@/stores/loading'
import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'

export const usePrintModalStore = defineStore('printModal', () => {
  const apiStore = useApiStore()
  const loadingStore = useLoadingStore()
  const showPrintModal = ref(false)
  const printingText = ref(false)
  const attendeeId = ref(null)
  const ticketId = ref(null)
  //id of all options
  const allOptions = ref([])
  //for user interaction
  const printOptions = ref([])
  //updates when checked
  const selectedOptions = ref([])

  const hasOptions = computed(() => {
    return allOptions.value.length !== 0
  })

  function $reset() {
    showPrintModal.value = false
    printingText.value = false
    attendeeId.value = null
    ticketId.value = null
    allOptions.value = []
    printOptions.value = []
    selectedOptions.value = []
  }

  async function getBadgeFields() {
    try {
      const fields = await apiStore.get(true, `tickets/${ticketId.value}/badge-forms`)
      allOptions.value = fields.map((field) => {
        return {
          id: field.field_identifier,
          name: field.custom_field
        }
      })

      //remove QR from array
      printOptions.value = allOptions.value.filter((field) => field.id !== 'QR')
      //set selected options to all options
      selectedOptions.value = printOptions.value
    } catch (error) {
      console.error(error)
    }
  }

  function selectAll() {
    selectedOptions.value = printOptions.value
  }

  async function setPrintDetails(tid, aid) {
    loadingStore.contentLoading()
    ticketId.value = String(tid)
    attendeeId.value = String(aid)
    try {
      await getBadgeFields()
      loadingStore.contentLoaded()
    } catch (error) {
      console.error(error)
    }
    nextTick(() => {
      showPrintModal.value = true
    })
  }

  async function getPDF(fields) {
    try {
      const url = await apiStore.get(
        true,
        `badge-forms/print-badge-pdf?attendee_id=${attendeeId.value}&list_field_show=${fields}`
      )

      //check if state is production
      // need to use URL from same domain to prevent origin error
      let objFra = document.getElementById('printFrame')

      if (process.env.NODE_ENV !== 'production') {
        objFra.src = '/test-badge.pdf'
      } else {
        const pdf = await apiStore.get(true, url.task_url.substring(4))
        objFra.src = pdf.result.download_url
      }
      objFra.onload = () => {
        // Trigger the print function
        objFra.contentWindow.print()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    showPrintModal,
    printingText,
    ticketId,
    attendeeId,
    allOptions,
    printOptions,
    selectedOptions,
    hasOptions,
    selectAll,
    $reset,
    setPrintDetails,
    getBadgeFields,
    getPDF
  }
})
