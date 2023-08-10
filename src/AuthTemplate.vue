<script setup>
import NavBar from '@/components/NavBar.vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>
<template>
  <div class="flex flex-col h-screen w-full">
    <NavBar />
    <div class="grow flex mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <RouterView />
    </div>
  </div>
  <LoadingView v-if="useLoadingStore().show"></LoadingView>
</template>
