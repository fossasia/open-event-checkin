<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import StandardButton from '@/components/Common/StandardButton.vue'
import { useCameraStore } from '@/stores/camera'
import RefreshButton from '@/components/Utilities/RefreshButton.vue'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'

const cameraStore = useCameraStore()

const emit = defineEmits(['scanned'])
</script>
<template>
  <qrcode-stream
    class="!aspect-square !h-auto max-w-sm"
    :track="cameraStore.selected.value"
    :camera="cameraStore.cameraSide"
    @init="cameraStore.logErrors"
    @decode="emit('scanned')"
  />
  <div class="space-x-3">
    <StandardButton
      :text="'Switch Camera'"
      :icon="ArrowsRightLeftIcon"
      class="mt-4 bg-primary"
      @click="cameraStore.toggleCameraSide"
    />
    <RefreshButton class="mt-4" />
  </div>
</template>
