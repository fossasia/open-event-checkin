<script setup>
import { computed, ref } from 'vue'
import { DialogTitle } from '@headlessui/vue'
import ModalBaseTemplate from '@/components/Modals/ModalBaseTemplate.vue'
import { PrinterIcon } from '@heroicons/vue/24/outline'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import StandardButton from '@/components/Shared/StandardButton.vue'
import { usePrintModalStore } from '@/stores/printModal'
import { useNotificationStore } from '@/stores/notification'

const printModalStore = usePrintModalStore()
const notificationStore = useNotificationStore()

const disableButton = ref(false)
const printingText = ref(false)

const titleText = computed(() => (printModalStore.validQRCode.value ? 'Select items to print' : 'Error!'))
const messageText = computed(() => (!printModalStore.validQRCode.value ? 'Please scan a valid QR code' : ''))

const printDelay = (delayHideModal, delayPrint) => {
  setTimeout(() => printModalStore.showPrintModal.value = false, delayHideModal)
  setTimeout(() => {
    notificationStore.addNotification(
          ['Successfully printed!', 'Please collect your ticket.'],
          'success'
        )
    printModalStore.reset()
  }, delayPrint)
}

const print = () => {
  if (printModalStore.validQRCode.value) {
    printModalStore.printOptions.forEach((element) => (element.disabled = true))
    printingText.value = true
    disableButton.value = true
    console.log(printModalStore.selectedOptions)
    printDelay(3000, 3200)
  } else {
    printDelay(0, 200)
    console.log('Rescan')
  }
}
</script>

<template>
  <ModalBaseTemplate :show="printModalStore.showPrintModal">
      <div>
        <!--Icons-->
        <div
          :class="[printModalStore.validQRCode.value ? 'bg-success-light' : 'bg-danger-light']"
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        >
          <PrinterIcon v-if="printModalStore.validQRCode.value" class="h-6 w-6 text-success" aria-hidden="true" />
          <ExclamationCircleIcon v-else class="h-6 w-6 text-danger" aria-hidden="true" />
        </div>

        <!--Title-->
        <div class="mt-3 text-center sm:mt-5">
          <DialogTitle as="h3">
            <span v-if="!printingText">{{ titleText }}</span>
            <span v-else>Printing...</span>
          </DialogTitle>

          <!--Checklist-->
          <fieldset v-if="printModalStore.validQRCode.value">
            <div class="space-y-5 mt-6 sm:mt-5 flex flex-col items-start">
              <div
                v-for="(printOption, index) in printModalStore.printOptions"
                :key="index"
                class="relative flex items-start px-12 sm:px-6 first:grayscale"
              >
                <div class="flex h-6 items-center">
                  <input
                    :id="printOption.id"
                    :disabled="printOption.disabled"
                    :name="printOption.name"
                    :checked="printOption.checked"
                    type="checkbox"
                    class="h-4 w-4 rounded border-secondary text-blue-600 focus:ring-blue-600"
                    @click="printModalStore.selectOption(printOption)"
                  />
                </div>
                <div class="ml-3 text-sm leading-6 text-start">
                  <label :for="printOption.id" class="font-medium text-body">{{
                    printOption.label
                  }}</label>
                </div>
              </div>
              <!--Select all button-->
              <StandardButton
                :text="printModalStore.selectedOptions.length === 5 ? 'Deselect All' : 'Select All'"
                :disabled="disableButton"
                :class="[
                  disableButton
                    ? 'cursor-not-allowed opacity-20'
                    : 'hover:bg-blue-500 hover:border-blue-500 hover:text-white',
                  'text-blue-600 border border-blue-600 ml-6'
                ]"
                @click="printModalStore.selectOrDeselectAll"
              />
            </div>

            <!--DIVIDER-->
            <div class="mt-5">
              <div class="border-0 border-b mx-6 sm:m-0" />
            </div>
          </fieldset>
          <p v-if="messageText !== ''" class="text-sm bg-secondary mt-3">
            {{ messageText }}
          </p>
          <p v-if="printingText" class="text-sm bg-secondary mt-3">
            Please wait while we print your pass.
          </p>
        </div>
      </div>

      <!--Print button-->
      <div class="mt-6 sm:mt-5 mx-6 sm:mx-0">
        <StandardButton
          :text="printModalStore.validQRCode.value ? 'Print' : 'Try Again'"
          :disabled="disableButton"
          :class="[
            disableButton && 'cursor-not-allowed opacity-20',
            'bg-primary text-white hover:bg-blue-500 w-full justify-center'
          ]"
          @click="print"
        />
      </div>
  </ModalBaseTemplate>
</template>
