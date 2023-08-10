import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiStore } from '@/stores/api'

export const usePrintModalStore = defineStore('printModal', () => {
  const attendeeId = ref(null)
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

  async function getBadgeFields(response) {
    try {
      attendeeId.value = response.attendeeId
      const fields = await useApiStore().get(true, `tickets/${response.ticketId}/badge-forms`)
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

  async function displayAndPrintPDF(pdf) {
    try {
      const pdfBlob = pdf
      const pdfUrl = URL.createObjectURL(pdfBlob);
      // Create an iframe to display the PDF
      const pdfIframe = document.createElement('iframe');
      pdfIframe.style.display = 'none';
      pdfIframe.src = pdfUrl;
      // Append the iframe to the document
      document.body.appendChild(pdfIframe);
      // Wait for the iframe to load
      await new Promise((resolve) => pdfIframe.onload = resolve);
      // Print the PDF using the print function of the browser
      pdfIframe.contentWindow.print();
      // Clean up: remove the iframe after printing
      document.body.removeChild(pdfIframe);
    } catch (error) {
      console.error('Error displaying or printing the PDF:', error);
    }
  }

  async function getPDF() {
    console.log(selectedOptions.value)
    try {
      const fieldNames = selectedOptions.value.map((option) => option.fieldIdentifier)
      const payload = {
        attendee_id: attendeeId.value,
        list_field_show: fieldNames
      }
      console.log(payload)
      await useApiStore().post(true, 'badge-forms/print-badge-pdf', payload, false)
        .then((res) => res.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL('a');
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //after
        })

      // Convert raw string to Uint8Array
      const uint8Array = new TextEncoder().encode(pdf);
      console.log(pdf)
      console.log(uint8Array)

      // Create a Blob from the Uint8Array
      const blob = new Blob(uint8Array, { type: 'application/pdf' });
      displayAndPrintPDF(blob)

    } catch (error) {
      console.error(error)
    }
  }

  return { printOptions, selectedOptions, selectOption, selectOrDeselectAll, reset, getBadgeFields, getPDF }
})
