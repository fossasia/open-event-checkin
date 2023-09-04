<script setup>
import NavBar from '@/components/NavBar.vue'
import { RouterView } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import NotificationHolder from '@/components/Notifications/NotificationHolder.vue'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>

<template>
  <div class="w-full">
    <NavBar />
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <RouterView />
    </div>
  </div>
  <NotificationHolder />
  <LoadingView v-if="useLoadingStore().loading"></LoadingView>
</template>
