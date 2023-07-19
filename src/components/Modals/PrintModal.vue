<script setup>
import { onMounted, ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PrinterIcon } from '@heroicons/vue/24/outline'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import StandardButton from '@/components/Shared/StandardButton.vue'

const props = defineProps({
  showNotification: Boolean,
  validQRCode: Boolean
})
const emit = defineEmits(['update:show-modal', 'print'])
const updateLocalShowNotification = (value) => {
  open.value = value
  emit('update:show-modal', value)
}

// INITIALISE TEMPLATE REFS
const selectAll = ref(null)
const intermediate = ref(null)
const refs = ref([])
onMounted(() => {
  refs.value = Array(printOptions.length)
    .fill(null)
    .map(() => ref(null))
})
function setRef(index) {
  return (el) => {
    refs.value[index] = el
  }
}

const notificationContent = ref({
  titleText: '',
  messageText: '',
  buttonText: ''
})

if (props.validQRCode) {
  notificationContent.value.titleText = 'Select items to print'
  notificationContent.value.messageText = ''
  notificationContent.value.buttonText = 'Print'
} else {
  notificationContent.value.titleText = 'Error!'
  notificationContent.value.messageText = 'Please scan a valid QR code.'
  notificationContent.value.buttonText = 'Try Again'
}

const disableButton = ref(false)
const open = ref(false)

const print = () => {
  if (props.validQRCode) {
    emit('print')
    notificationContent.value.titleText = 'Printing...'
    notificationContent.value.messageText = 'Please wait while we print your pass.'
    disableButton.value = true
    console.log(selectedOptions.value)
    setTimeout(() => updateLocalShowNotification(false), 3000)
  } else {
    updateLocalShowNotification(false)
    console.log('Rescan')
  }
}

const printOptions = [
  { id: 'name', name: 'Name', label: 'Name' },
  { id: 'email', name: 'Email', label: 'Email' },
  { id: 'org', name: 'Organisation', label: 'Organisation' },
  { id: 'role', name: 'Role', label: 'Role' }
]

const selectedOptions = ref([])
const showIntermediate = ref(false)
const allSelected = ref(false)

watch(selectedOptions, () => {
  var showIntVal, allSelVal
  if (selectedOptions.value.length == 0) {
    showIntVal = false
    allSelVal = false
  } else if (selectedOptions.value.length == 4) {
    showIntVal = false
    allSelVal = true
  } else {
    showIntVal = true
    allSelVal = false
  }
  showIntermediate.value = showIntVal
  allSelected.value = allSelVal
  selectAll.value.checked = allSelVal
})

const selectOrDeselectAll = () => {
  if (selectAll.value.checked == true) {
    printOptions.forEach((element, index) => {
      refs.value[index].checked = true
      selectedOptions.value.push(element.id)
    })
  } else {
    printOptions.forEach((element, index) => {
      refs.value[index].checked = false
      selectedOptions.value.pop(element.id)
    })
  }
  allSelected.value = selectAll.value.checked
  console.log(selectedOptions.value)
}

const deselectAll = () => {
  showIntermediate.value = false
  printOptions.forEach((element) => selectedOptions.value.pop(element.id))
  console.log(selectedOptions.value)
}

watch(
  () => props.showNotification,
  (value) => {
    open.value = value
    setTimeout(() => {
      printOptions.forEach((element, index) => {
        refs.value[index].checked = true
        selectedOptions.value.push(element.id)
      })
      selectAll.value.checked = true
    }, 0)
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6"
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
                  <fieldset v-if="props.validQRCode">
                    <div class="space-y-5 mt-6 sm:mt-5">
                      <div
                        v-for="(printOption, index) in printOptions"
                        :key="index"
                        class="relative flex items-start px-12 sm:px-6"
                      >
                        <div class="flex h-6 items-center">
                          <input
                            :ref="setRef(index)"
                            :id="printOption.id"
                            :name="printOption.name"
                            :value="printOption.id"
                            v-model="selectedOptions"
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

                      <!--DIVIDER-->
                      <div class="relative">
                        <div class="absolute inset-0 flex items-center" aria-hidden="true">
                          <div class="w-full border-t border-gray-300 mx-12 sm:mx-6" />
                        </div>
                      </div>

                      <div class="pt-4 relative flex items-start px-12 sm:px-6">
                        <div class="flex h-6 items-center">
                          <input
                            v-show="!showIntermediate"
                            ref="selectAll"
                            id="select-all"
                            name="Select-all"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            @click="selectOrDeselectAll"
                          />
                          <input
                            v-if="showIntermediate"
                            ref="intermediate"
                            id="intermediate"
                            name="intermediate"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            @click="deselectAll"
                          />
                          <button
                            v-if="showIntermediate"
                            type="button"
                            class="h-4 w-4 absolute bg-gray-500 rounded"
                            @click="deselectAll"
                          >
                            <div class="mx-[2.5px] h-[3px] bg-white rounded-full" />
                          </button>
                        </div>
                        <div class="ml-3 text-sm leading-6 text-start">
                          <label
                            v-if="!showIntermediate"
                            for="select-all"
                            class="font-medium text-gray-900"
                          >
                            <span v-if="allSelected">Deselect all</span>
                            <span v-else>Select all</span>
                          </label>
                          <label
                            v-if="showIntermediate"
                            for="intermediate"
                            class="font-medium text-gray-900"
                          >
                            Deselect all
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <div
                    class="mt-3"
                    v-if="notificationContent.messageText == 'Please scan a valid QR code.'"
                  >
                    <p class="text-sm text-gray-500">
                      {{ notificationContent.messageText }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-6 sm:mt-5 mx-6 sm:mx-0">
                <StandardButton
                  :text="notificationContent.buttonText"
                  :disabled="disableButton"
                  @click="print"
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
