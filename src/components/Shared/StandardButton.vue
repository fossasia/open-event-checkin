<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  text: String,
  icon: Function,
  disabled: Boolean
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="inline-flex items-center rounded-md px-2.5 py-2 text-sm font-medium transition-all"
  >
    <component v-if="props.icon" :is="props.icon" class="h-5 mr-1" />
    <span>{{ props.text }}</span>
  </button>
</template>
