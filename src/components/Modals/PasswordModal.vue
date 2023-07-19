<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import StandardButton from '@/components/Shared/StandardButton.vue'

const props = defineProps({
  showNotification: Boolean
})

const emit = defineEmits(['updateShowModal'])

const open = ref(false)

watch(
  () => props.showNotification,
  (value) => {
    open.value = value
  }
)

const passwordField = ref('')
const validPassword = ref(null)

const checkPassword = (value) => {
  // check password here
  if (value === '1234') {
    validPassword.value = true
    emit('updateShowModal', false)
    passwordField.value = ''
    // sign out
  } else {
    validPassword.value = false
    passwordField.value = ''
  }
}
</script>

<template>
  <TransitionRoot as="template" :show="open" @click="$emit('updateShowModal', false)">
    <Dialog as="div" class="relative z-10">
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
                  @click="checkPassword(passwordField)"
                  class="bg-blue-600 text-white hover:bg-blue-500 w-full justify-center"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
