<script setup>
import { ref, watch } from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  selectText: {
    type: String,
    default: 'Select'
  },
  data: {
    type: Array,
    default: []
  },
  selectedOption: {
    type: Object,
    default: { id: undefined, name: '' }
  }
})

const emit = defineEmits(['updateSelected'])

const mutateSelected = ref(props.selectedOption)

watch(
  () => mutateSelected.value,
  (val) => {
    console.log(val)
    emit('updateSelected', val)
  }
)
</script>
<template>
  <Listbox v-model="mutateSelected" as="div">
    <ListboxLabel class="block text-sm font-medium leading-6">{{ label }}</ListboxLabel>
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-body shadow-sm ring-1 ring-inset ring-secondary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
      >
        <span v-if="mutateSelected.name == ''" class="block truncate text-secondary">{{
          selectText
        }}</span>
        <span class="block truncate">{{ mutateSelected.name }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-secondary" aria-hidden="true" />
        </span>
      </ListboxButton>
      <ListboxOptions
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-secondary ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ListboxOption
          v-for="d in data"
          :key="d.id"
          v-slot="{ active, selected }"
          as="template"
          :value="d"
        >
          <li
            :class="[
              active ? 'bg-primary text-white' : 'text-body',
              'relative cursor-default select-none py-2 pl-3 pr-9'
            ]"
          >
            <span :class="[active ? 'font-semibold' : 'font-normal', 'block truncate']">{{
              d.name
            }}</span>

            <span
              v-if="selected"
              :class="[
                active ? 'text-white bg-primary' : 'text-body',
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
