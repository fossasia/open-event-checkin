<script setup>
import QRCamera from '@/components/Common/QRCamera.vue'
import { useLoadingStore } from '@/stores/loading'
import PrintModal from '@/components/Modals/PrintModal.vue'

const loadingStore = useLoadingStore()
loadingStore.contentLoaded()
</script>

<template>
  <div
    class="-mt-16 grid h-screen w-full grid-cols-1 place-items-center items-center justify-center align-middle"
  >
    <QRCamera :qr-type="'registration'" :scan-type="'Registration'" />
  </div>
  <PrintModal />
</template>
