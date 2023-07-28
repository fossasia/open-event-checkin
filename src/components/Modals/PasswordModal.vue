<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
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
const disableButton = ref(false)

async function checkPassword(value) {
  disableButton.value = true
  loadingStore.show = true
  const payload = { password: passwordField.value }

  await authStore.verifyPassword(payload, 'auth/verify-password').then((res) => {
    if (res.result) {
      authStore.logout('auth/logout').then((res) => console.log(res)) // post logout api and clear local storage
      validPassword.value = true
      emit('hidePasswordModal', false)
      // sign out
      router.push({
        name: 'userAuth'
      })
      loadingStore.show = false
    } else {
      loadingStore.show = false
      disableButton.value = false
      validPassword.value = false
      passwordField.value = ''
    }
  })
}
</script>

<template>
  <TransitionRoot
    as="template"
    :show="props.showPasswordModal"
    @click="$emit('hidePasswordModal', false)"
  >
    <Dialog as="div" class="relative z-30">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"
                >
                  <EllipsisHorizontalIcon class="h-6 w-6 text-gray-700" aria-hidden="true" />
                </div>
                <div class="mt-3 sm:mt-5 text-center">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900"
                    >Please Input Your Password</DialogTitle
                  >
                  <div class="mt-5 sm:mt-6">
                    <input
                      v-model="passwordField"
                      type="password"
                      name="password"
                      id="password"
                      autocomplete="password"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p
                    v-if="validPassword != true && validPassword != null"
                    class="text-red-500 text-sm text-left mt-2"
                  >
                    Incorrect Password
                  </p>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <StandardButton
                  text="Sign Out"
                  :disabled="disableButton"
                  @click="checkPassword(passwordField)"
                  :class="[
                    disableButton && 'cursor-not-allowed opacity-20',
                    'bg-blue-600 text-white hover:bg-blue-500 w-full justify-center'
                  ]"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
