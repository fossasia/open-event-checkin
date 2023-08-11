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
  <button :type="props.type" :disabled="props.disabled" class="inline-flex items-center">
    <component
      :is="props.icon"
      v-if="props.icon"
      :class="[props.text !== '' ? 'h-5 mr-1' : 'h-5']"
    />
    <span>{{ props.text }}</span>
    <component
      :is="props.iconAfter"
      v-if="props.iconAfter"
      :class="[props.text !== '' ? 'h-5 ml-1' : 'h-5']"
    />
  </button>
</template>
