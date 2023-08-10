<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import NotificationBaseTemplate from '@/components/Notifications/NotificationBaseTemplate.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: ['']
  }
})
</script>

<template>
  <NotificationBaseTemplate>
    <template #icon>
      <CheckCircleIcon class="h-6 w-6 text-success" aria-hidden="true" />
    </template>
    <template #messages>
      <p v-for="msg in messages" class="text-sm font-medium">{{ msg }}</p>
    </template>
  </NotificationBaseTemplate>
</template>
