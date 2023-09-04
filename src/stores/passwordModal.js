import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePasswordModalStore = defineStore('passwordModal', () => {
  const showPasswordModal = ref(false)
  const passwordField = ref('')
  const validPassword = ref(null)

  function $reset() {
    showPasswordModal.value = false
    passwordField.value = null
    validPassword.value = null
  }

  return { showPasswordModal, passwordField, validPassword, $reset }
})
