import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import { ref } from 'vue'

export const usePrintModalStore = defineStore('printModal', () => {
  const printOptions = [
    {
      id: 'code',
      name: 'code',
      label: 'QR Code',
      checked: ref(true),
      disabled: true
    },
    {
      id: 'name',
      name: 'name',
      label: 'Name',
      checked: ref(true),
      disabled: false
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      checked: ref(true),
      disabled: false
    },
    {
      id: 'org',
      name: 'org',
      label: 'Organisation',
      checked: ref(true),
      disabled: false
    },
    {
      id: 'role',
      name: 'role',
      label: 'Role',
      checked: ref(true),
      disabled: false
    }
  ]

  //updates when checked
  const selectedOptions = ref(['code', 'name', 'email', 'org', 'role'])

  function selectOption(option) {
    option.checked = !option.checked
    if (!option.checked) {
      selectedOptions.value.splice(selectedOptions.value.indexOf(option.id), 1)
    } else {
      selectedOptions.value.push(option.id)
    }
  }

  function selectOrDeselectAll() {
    if (selectedOptions.value.length == 5) {
      printOptions.forEach((option) => {
        if (option.id !== 'code') {
          option.checked.value = false
          selectedOptions.value = ['code']
        }
      })
    } else {
      printOptions.forEach((option) => {
        option.checked.value = true
        selectedOptions.value = ['code', 'name', 'email', 'org', 'role']
      })
    }
  }

  function reset() {
    selectedOptions.value = ['code', 'name', 'email', 'org', 'role']
    printOptions.forEach((option) => {
      if (option.id !== 'code') {
        option.disabled = false
        option.checked.value = true
      }
    })
  }

  return { printOptions, selectedOptions, selectOption, selectOrDeselectAll, reset }
})
