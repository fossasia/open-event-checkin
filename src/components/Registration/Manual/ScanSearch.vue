<script setup>
import QRCamera from '@/components/Common/QRCamera.vue'
import SearchAttendee from '@/components/Registration/Manual/SearchAttendee.vue'
import { useLoadingStore } from '@/stores/loading'
import { usePrintModalStore } from '@/stores/printModal'

const loadingStore = useLoadingStore()
const printModalStore = usePrintModalStore()
loadingStore.contentLoaded()
</script>

<template>
  <div
    class="-mt-16 grid h-screen w-full grid-cols-1 place-items-center items-center justify-center align-middle lg:grid-cols-2"
  >
    <QRCamera :qr-type="'registration'" />
    <div class="h-full w-full py-24">
      <h2 class="mb-3 text-center">Search by name or email</h2>
      <SearchAttendee @print="printModalStore.showPrintModal = true" />
    </div>
  </div>
</template>
