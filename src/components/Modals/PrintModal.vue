<script setup>
import { computed, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PrinterIcon } from '@heroicons/vue/24/outline'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import StandardButton from '@/components/Shared/StandardButton.vue'

const props = defineProps({
  showPrintModal: Boolean,
  validQRCode: Boolean
})
const emit = defineEmits(['hideModal', 'print'])

const disableButton = ref(false)
const selectedOptions = ref(['code', 'name', 'email', 'org', 'role'])

const printingText = ref(false)
const titleText = computed(() => props.validQRCode ? 'Select items to print' : 'Error!')
const messageText = computed(() => !props.validQRCode ? 'Please scan a valid QR code' : '')

const printDelay = (delayHideModal, delayPrint) => {
  setTimeout(() => emit('hideModal'), delayHideModal)
  setTimeout(() => emit('print'), delayPrint)
}

const print = () => {
  if (props.validQRCode) {
    printOptions.forEach((element) => (element.disabled = true))
    printingText.value = true
    disableButton.value = true
    console.log(selectedOptions.value)
    printDelay(3000, 3200)
  } else {
    printDelay(0, 200)
    console.log('Rescan')
  }
}

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

const selectOption = (option) => {
  option.checked.value = !option.checked.value
  if (!option.checked.value) {
    selectedOptions.value.splice(selectedOptions.value.indexOf(option.id), 1)
  } else {
    selectedOptions.value.push(option.id)
  }
  console.log(selectedOptions.value)
}

const selectOrDeselectAll = () => {
  if (selectedOptions.value.length == 5) {
    printOptions.forEach((element) => {
      if (element.id !== 'code') {
        element.checked.value = false
        selectedOptions.value = ['code']
      }
    })
  } else {
    printOptions.forEach((element) => {
      element.checked.value = true
      selectedOptions.value = ['code', 'name', 'email', 'org', 'role']
    })
  }
  console.log(selectedOptions.value)
}
</script>

<template>
  <TransitionRoot as="template" :show="props.showPrintModal">
    <Dialog as="div" class="relative z-10" @close="$emit('hideModal')">
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
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
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
              class="w-full h-screen absolute top-0 left-0 flex justify-center items-center"
            >
              <div
                class="relative transform overflow-hidden rounded-lg bg-white px-4 mx-6 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6"
              >
                <div>
                  <!--Icons-->
                  <div
                    :class="[props.validQRCode ? 'bg-green-100' : 'bg-red-100']"
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                  >
                    <PrinterIcon
                      v-if="validQRCode"
                      class="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                    <ExclamationCircleIcon v-else class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>

                  <!--Title-->
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      <span v-if="!printingText">{{ titleText }}</span>
                      <span v-else>Printing...</span>
                    </DialogTitle>

                    <!--Checklist-->
                    <fieldset v-if="props.validQRCode">
                      <div class="space-y-5 mt-6 sm:mt-5 flex flex-col items-start">
                        <div
                          v-for="(printOption, index) in printOptions"
                          :key="index"
                          class="relative flex items-start px-12 sm:px-6 first:grayscale"
                        >
                          <div class="flex h-6 items-center">
                            <input
                              @click="selectOption(printOption)"
                              :disabled="printOption.disabled"
                              :id="printOption.id"
                              :name="printOption.name"
                              :checked="printOption.checked.value"
                              type="checkbox"
                              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                          </div>
                          <div class="ml-3 text-sm leading-6 text-start">
                            <label :for="printOption.id" class="font-medium text-gray-900">{{
                              printOption.label
                            }}</label>
                          </div>
                        </div>
                        <!--Select all button-->
                        <StandardButton
                          @click="selectOrDeselectAll"
                          :disabled="disableButton"
                          :text="selectedOptions.length == 5 ? 'Deselect All' : 'Select All'"
                          :class="[
                            disableButton
                              ? 'cursor-not-allowed opacity-20'
                              : 'hover:bg-blue-500 hover:border-blue-500 hover:text-white',
                            'text-blue-600 border border-blue-600 ml-6'
                          ]"
                        />
                      </div>

                      <!--DIVIDER-->
                      <div class="mt-5">
                        <div class="border-0 border-b mx-6 sm:m-0" />
                      </div>
                    </fieldset>
                    <p v-if="messageText !== ''" class="text-sm text-gray-500 mt-3">
                      {{ messageText }}
                    </p>
                    <p v-if="printingText" class="text-sm text-gray-500 mt-3">
                      Please wait while we print your pass.
                    </p>
                  </div>
                </div>

                <!--Print button-->
                <div class="mt-6 sm:mt-5 mx-6 sm:mx-0">
                  <StandardButton
                    :text="props.validQRCode ? 'Print' : 'Try Again'"
                    :disabled="disableButton"
                    @click="print"
                    :class="[
                      disableButton && 'cursor-not-allowed opacity-20',
                      'bg-blue-600 text-white hover:bg-blue-500 w-full justify-center'
                    ]"
                  />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
