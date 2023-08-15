import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiStore } from '@/stores/api'

export const usePrintModalStore = defineStore('printModal', () => {
  const showPrintModal = ref(false)
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
    selectedOptions.value = allOptions.value
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
      printOptions.value = fields.map((field) => {
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

  async function getPDF() {
    // get pdf api here
    // return pdf url
  }

  return { showPrintModal, ticketId, printOptions, selectedOptions, selectOption, selectOrDeselectAll, reset, getBadgeFields, getPDF }
})
