<script setup>
import { RouterView } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="grow flex">
      <RouterView class="grow m-6 flex flex-col" />
    </div>
  </div>
  <LoadingView v-if="useLoadingStore().show"></LoadingView>
</template>
