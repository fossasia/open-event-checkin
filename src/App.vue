<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <div class="mx-3 grow flex">
      <RouterView class="grow flex flex-col" />
    </div>
  </div>
</template>
