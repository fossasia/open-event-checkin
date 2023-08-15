import { defineStore } from 'pinia'
import { ref } from 'vue'
import print from 'print-js'
import { useApiStore } from '@/stores/api'

export const usePrintModalStore = defineStore('printModal', () => {
  const showPrintModal = ref(false)
  const attendeeId = ref(null)
  const ticketId = ref(null)
  //for user interaction
  const printOptions = ref([])

  //id of all options
  const allOptions = ref([])
  //updates when checked
  const selectedOptions = ref([])

  function selectOption(option) {
    option.checked = !option.checked
    if (!option.checked) {
      selectedOptions.value.splice(selectedOptions.value.indexOf(option.id), 1)
    } else {
      selectedOptions.value.push(option.id)
    }
  }

  function selectOrDeselectAll() {
    if (selectedOptions.value.length === 5) {
      printOptions.value.forEach((option) => {
        if (option.name !== 'code') {
          option.checked = false
          selectedOptions.value = allOptions.value.find((option) => option.name === 'code')
        }
      })
    } else {
      printOptions.value.forEach((option) => {
        option.checked = true
        selectedOptions.value = allOptions.value
      })
    }
  }

  function reset() {
    attendeeId.value = null
    ticketId.value = null
    selectedOptions.value = []
    allOptions.value = []
    printOptions.value.forEach((option) => {
      if (option.name !== 'code') {
        option.disabled = false
        option.checked = true
      }
    })
  }

  async function getBadgeFields() {
    try {
      const fields = await useApiStore().get(true, `tickets/${ticketId.value}/badge-forms`)
      printOptions.value = fields
        .map((field) => {
          if (field.field_identifier === 'QR') {
            return {
              id: field.id,
              name: 'code',
              label: 'QR Code',
              fieldIdentifier: field.field_identifier,
              checked: ref(true),
              disabled: true
            }
          } else {
            return {
              id: field.id,
              name: field.custom_field,
              label: field.custom_field,
              fieldIdentifier: field.field_identifier,
              checked: ref(true),
              disabled: false
            }
          }
        })
      // move QR to front of array
      const QRField = printOptions.value.splice(printOptions.value.indexOf((element) => element.field_identifier === 'QR'), 1)[0]
      printOptions.value.unshift(QRField)

      allOptions.value = printOptions.value.map((option) => {
        return {
          name: option.name,
          id: option.id,
          fieldIdentifier: option.fieldIdentifier
        }
      })
      selectedOptions.value = allOptions.value
    } catch (error) {
      console.error(error)
    }
  }

  function printPDF(blob) {
    var reader = new FileReader()
    reader.onload = function () {
      //Remove the data:application/pdf;base64,
      printJS({
        printable: reader.result.substring(28),
        type: 'pdf',
        base64: true
      })
    }
    reader.readAsDataURL(blob)
  }

  async function getPDF(fields) {
    try {
      console.log(fields, attendeeId.value)
      const url = await useApiStore().get(true, `badge-forms/print-badge-pdf?attendee_id=${attendeeId.value}&list_field_show=${fields}`)
      const pdf = await useApiStore().get(true, url.task_url.substring(4))
      const link = new Blob([pdf.result.download_url], { type: 'application/pdf' })
      //print
      printPDF(link)
    } catch (error) {
      console.error(error)
    }
  }

  return { showPrintModal, ticketId, attendeeId, printOptions, selectedOptions, selectOption, selectOrDeselectAll, reset, getBadgeFields, getPDF }

})
