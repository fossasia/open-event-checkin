<script setup>
import { ref } from 'vue'
import { DialogTitle } from '@headlessui/vue'
import ModalBaseTemplate from '@/components/Modals/ModalBaseTemplate.vue'
import { KeyIcon } from '@heroicons/vue/24/outline'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const router = useRouter()

const props = defineProps({
  showPasswordModal: Boolean
})

const emit = defineEmits(['hidePasswordModal'])

const passwordField = ref('')
const validPassword = ref(null)

async function checkPassword() {
  loadingStore.show = true
  const payload = { password: passwordField.value }

  try {
    const res = await authStore.verifyPassword(payload, 'auth/verify-password')
    if (res === true) {
      console.log('Password verified: correct')
      await authStore.logout()
      validPassword.value = true
      emit('hidePasswordModal', false)
      router.push({
        name: 'userAuth'
      })
    } else {
      console.log('Password verified: incorrect')
      loadingStore.show = false
      validPassword.value = false
      passwordField.value = ''
    }
  } catch (error) {
    console.log(error)
    loadingStore.show = false
    validPassword.value = false
    passwordField.value = ''
  }
}
</script>

<template>
  <ModalBaseTemplate :show="props.showPasswordModal">
    <form @submit.prevent="checkPassword">
      <div>
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-info-light">
          <KeyIcon class="h-6 w-6 text-info-dark" aria-hidden="true" />
        </div>
        <div class="mt-5 text-center">
          <DialogTitle as="h3">Please Input Your Password</DialogTitle>
          <div class="mt-6">
            <input
              id="password"
              v-model="passwordField"
              type="password"
              name="password"
              autocomplete="password"
              class="block w-full"
            />
          </div>
          <p
            v-if="validPassword != true && validPassword != null"
            class="text-danger text-sm text-left mt-2"
          >
            Incorrect Password
          </p>
        </div>
      </div>
      <div class="mt-6">
        <StandardButton
          type="submit"
          text="Sign Out"
          :disabled="passwordField === ''"
          class="btn-primary w-full justify-center"
        />
      </div>
    </form>
  </ModalBaseTemplate>
</template>
