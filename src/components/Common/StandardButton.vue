<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Function,
    default: () => null
  },
  iconAfter: {
    type: Function,
    default: () => null
  }
})
</script>

<template>
  <button :type="type" :disabled="disabled" class="inline-flex items-center">
    <component :is="icon" v-if="icon" :class="[text !== '' ? 'mr-1 h-5' : 'h-5']" />
    <span>{{ text }}</span>
    <component :is="iconAfter" v-if="iconAfter" :class="[text !== '' ? 'ml-1 h-5' : 'h-5']" />
  </button>
</template>
