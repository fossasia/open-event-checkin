<script setup>
import { useNotificationStore } from '@/stores/notification'
import SuccessNotification from '@/components/Notifications/SuccessNotification.vue'
import ErrorNotification from '@/components/Notifications/ErrorNotification.vue'

const notificationStore = useNotificationStore()
</script>
<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 top-16 flex items-end px-4 py-6 sm:items-start sm:p-6 z-10"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <template v-for="notification in notificationStore.list" :key="notification.id">
        <SuccessNotification
          v-if="notification.type === 'success'"
          :messages="notification.messages"
        >
        </SuccessNotification>
        <ErrorNotification v-if="notification.type === 'error'" :messages="notification.messages">
        </ErrorNotification>
      </template>
    </div>
  </div>
</template>
