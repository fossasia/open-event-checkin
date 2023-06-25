<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PrinterIcon } from '@heroicons/vue/24/outline'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  showNotification: Boolean,
  validQRCode: Boolean
})

const notificationContent = ref({
  titleText: '',
  messageText: '',
  buttonText: ''
})
if (props.validQRCode) {
  notificationContent.value.titleText = 'QR Code Scanned!'
  notificationContent.value.messageText = 'Print your pass?'
  notificationContent.value.buttonText = 'Print'
} else {
  notificationContent.value.titleText = 'Error!'
  notificationContent.value.messageText = 'Please scan a valid QR code.'
  notificationContent.value.buttonText = 'Try Again'
}
const disableButton = ref(false)
const open = ref(false)
const emit = defineEmits(['update:show-modal', 'fire-function'])
const updateLocalShowNotification = (value) => {
  open.value = value
  emit('update:show-modal', value)
}

const fireFunction = () => {
  if (props.validQRCode) {
    emit('fire-function')
    notificationContent.value.titleText = 'Printing...'
    notificationContent.value.messageText = 'Please wait while we print your pass.'
    disableButton.value = true
    console.log('printing...')
  } else {
    // refresh page
    window.location.reload()
    console.log('refreshing page...')
  }
}

watch(
  () => props.showNotification,
  (value) => {
    open.value = value
  }
)
</script>

<template>
  <TransitionRoot v-if="notificationContent" as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="updateLocalShowNotification">
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
                  :class="{ 'bg-green-100': props.validQRCode, 'bg-red-100': !props.validQRCode }"
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                >
                  <PrinterIcon
                    v-if="validQRCode"
                    class="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                  <ExclamationCircleIcon v-else class="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">{{
                    notificationContent.titleText
                  }}</DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ notificationContent.messageText }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <button
                  type="button"
                  :disabled="disableButton"
                  :class="disableButton ? 'cursor-not-allowed opacity-20' : ''"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="fireFunction"
                >
                  {{ notificationContent.buttonText }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
