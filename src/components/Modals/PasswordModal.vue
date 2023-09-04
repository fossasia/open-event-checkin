<script setup>
import { DialogTitle } from '@headlessui/vue'
import ModalBaseTemplate from '@/components/Modals/ModalBaseTemplate.vue'
import { KeyIcon } from '@heroicons/vue/24/outline'
import StandardButton from '@/components/Common/StandardButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { usePasswordModalStore } from '@/stores/passwordModal'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const passwordModalStore = usePasswordModalStore()
const router = useRouter()

function clearFields() {
  loadingStore.contentLoaded()
  passwordModalStore.validPassword = false
  passwordModalStore.passwordField = ''
}

async function checkPassword() {
  loadingStore.contentLoading()
  const payload = { password: passwordModalStore.passwordField }

  try {
    const res = await authStore.verifyPassword(payload)
    if (res === true) {
      await authStore.logout()
      passwordModalStore.validPassword = true
      passwordModalStore.$reset()
      router.push({
        name: 'userAuth'
      })
    } else {
      clearFields()
    }
  } catch (error) {
    console.log(error)
    clearFields()
  }
}
</script>

<template>
  <ModalBaseTemplate :show="passwordModalStore.showPasswordModal">
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
              v-model="passwordModalStore.passwordField"
              type="password"
              name="password"
              autocomplete="password"
              class="block w-full"
            />
          </div>
          <p
            v-if="
              passwordModalStore.validPassword != true && passwordModalStore.validPassword != null
            "
            class="mt-2 text-left text-sm text-danger"
          >
            Incorrect Password
          </p>
        </div>
      </div>
      <div class="mt-6">
        <div class="grid grid-cols-2 gap-3">
          <StandardButton
            :type="'submit'"
            :text="'Sign Out'"
            :disabled="passwordModalStore.passwordField === ''"
            class="btn-primary w-full justify-center"
          />
          <StandardButton
            :type="'button'"
            :text="'Cancel'"
            class="btn-secondary w-full justify-center"
            @click="passwordModalStore.$reset()"
          />
        </div>
      </div>
    </form>
  </ModalBaseTemplate>
</template>
