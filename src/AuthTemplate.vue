<script setup>
import NavBar from '@/components/NavBar.vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>
<template>
  <div class="flex flex-col h-screen w-full">
    <NavBar />
    <div class="mx-3 grow flex">
      <RouterView class="grow flex flex-col" />
    </div>
  </div>
  <LoadingView v-if="useLoadingStore().show"></LoadingView>
</template>
