<script setup>
import { PrinterIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  text: String,
  render: Function,
  activated: Boolean,
  activatedText: String,
  actiatedRender: Function
})
</script>

<template>
  <button
    :type="props.type"
    class="inline-flex items-center rounded-md px-2.5 py-2 text-sm font-medium transition-all"
  >
    <component v-if="props.activated" :is="props.activatedRender" class="h-5 mr-1" />
    <component v-else :is="props.render" class="h-5 mr-1" />
    <span v-if="props.activated">{{ props.activatedText }}</span>
    <span v-else>{{ props.text }}</span>
  </button>
</template>
