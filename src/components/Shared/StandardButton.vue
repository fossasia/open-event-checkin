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
  icon: Function
})
</script>

<template>
  <button :type="props.type" :disabled="props.disabled">
    <component :is="props.icon" v-if="props.icon" class="h-5 mr-1" />
    <span>{{ props.text }}</span>
  </button>
</template>
