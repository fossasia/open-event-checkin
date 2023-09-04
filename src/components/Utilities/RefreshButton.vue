<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import StandardButton from '@/components/Common/StandardButton.vue'

function reload() {
  window.location.reload()
}
</script>
<template>
  <StandardButton :text="'Refresh'" :icon="ArrowPathIcon" class="bg-primary" @click="reload" />
</template>
