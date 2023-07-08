<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <div class="mx-3 grow">
      <RouterView class="h-full" />
    </div>
  </div>
</template>
