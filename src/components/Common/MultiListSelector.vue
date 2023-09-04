<script setup>
import { ref, watch } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: () => []
  },
  isSingle: {
    type: Boolean,
    default: false
  },
  selectedOption: {
    type: Object,
    default: () => ({ id: undefined, name: '' })
  },
  selectedOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['updateSelected'])

const mutateSelected = ref(props.isSingle ? props.selectedOption : props.selectedOptions)

watch(
  () => props.selectedOption,
  (val) => {
    mutateSelected.value = val
  }
)

watch(
  () => props.selectedOptions,
  (val) => {
    mutateSelected.value = val
  }
)

watch(
  () => mutateSelected.value,
  (val) => {
    emit('updateSelected', val)
  }
)
</script>
<template>
  <Listbox v-model="mutateSelected" as="div" multiple>
    <ListboxLabel v-if="label !== ''" class="block text-sm font-medium leading-6">{{
      label
    }}</ListboxLabel>
    <div :class="[label !== 'mt-2', 'relative']">
      <ListboxOptions
        static
        class="mt-1 max-h-fit w-full overflow-y-auto bg-white py-1 text-base sm:text-sm"
      >
        <ListboxOption v-for="d in data" :key="d.id" v-slot="{ selected }" as="template" :value="d">
          <li
            :class="[
              selected ? 'ring-success' : 'text-body',
              'relative my-5 cursor-pointer select-none rounded-lg py-3 pl-3 pr-9 ring-2 ring-inset'
            ]"
          >
            <span class="block truncate">{{ d.name }}</span>
            <span
              v-if="selected"
              :class="[
                selected ? 'text-success' : '',
                'absolute inset-y-0 right-0 flex items-center pr-4'
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>
