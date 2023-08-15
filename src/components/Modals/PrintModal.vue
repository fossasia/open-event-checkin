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

const titleText = 'Select items to print'

function printDelay(delayHideModal, delayPrint) {
  setTimeout(() => printModalStore.showPrintModal.value = false, delayHideModal)
  setTimeout(() => {
    notificationStore.addNotification(
          ['Successfully printed!', 'Please collect your ticket.'],
          'success'
        )
    printModalStore.reset()
  }, delayPrint)
}

function print() {
    printModalStore.printOptions.forEach((element) => (element.disabled = true))
    printingText.value = true
    disableButton.value = true
    
    printModalStore.getPDF()
    printDelay(3000, 3200)
  }
</script>

<template>
  <ModalBaseTemplate :show="printModalStore.showPrintModal">
      <div>
        <!--Icons-->
        <div
          class="bg-info-light mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        >
          <PrinterIcon class="h-6 w-6 text-info" aria-hidden="true" />
        </div>

        <!--Title-->
        <div class="mt-3 text-center sm:mt-5">
          <DialogTitle as="h3">
            <span v-if="!printingText">{{ titleText }}</span>
            <span v-else>Printing...</span>
          </DialogTitle>

          <!--Checklist-->
          <fieldset>
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
          </fieldset>
          <p v-if="printingText" class="text-sm bg-secondary mt-3">
            Please wait while we print your pass.
          </p>
        </div>
      </div>

      <!--Print button-->
      <div class="mt-6 space-y-3">
        <StandardButton
          :text="'Print'"
          :disabled="disableButton"
          :class="[
            disableButton && 'cursor-not-allowed opacity-20',
            'bg-primary text-white hover:bg-blue-500 w-full justify-center'
          ]"
          @click="print"
        />
        <StandardButton
          :type="'button'"
          :text="'Cancel'"
          class="btn-secondary w-full justify-center"
          @click="printModalStore.showPrintModal.value = false"
        />
      </div>
  </ModalBaseTemplate>
</template>
