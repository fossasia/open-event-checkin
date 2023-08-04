<script setup>
import { RouterView } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>

<template>
  <div>
    <RouterView />
    <LoadingView v-if="useLoadingStore().show"></LoadingView>
  </div>
</template>
