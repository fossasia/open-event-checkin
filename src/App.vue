<script setup>
import { RouterView } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import LoadingView from '@/components/Utilities/LoadingView.vue'
</script>

<template>
  <RouterView class="m-6 h-screen" />
  <LoadingView v-if="useLoadingStore().show"></LoadingView>
</template>
