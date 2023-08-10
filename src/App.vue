<script setup>
import { RouterView } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import NotificationHolder from '@/components/Notifications/NotificationHolder.vue'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>

<template>
  <div>
    <RouterView />
    <NotificationHolder />
    <LoadingView v-if="useLoadingStore().show"></LoadingView>
  </div>
</template>
