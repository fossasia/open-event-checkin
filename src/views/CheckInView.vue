<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useStationsStore } from '@/stores/stations'
import PrintModal from '@/components/Modals/PrintModal.vue'

const router = useRouter()
const route = useRoute()
const stationsStore = useStationsStore()

// // check validity of eventId and registration type
const eventId = route.params.eventId
const scannerType = route.params.scannerType

// // check if eventId and registrationType are valid
if (!eventId || !scannerType) {
  router.replace({ name: 'NotFound' })
}

// // check if registrationType is valid
// // loop through array if registrationType is in object id
const scannerTypes = stationsStore.stationTypes
const scannerTypeIsValid = scannerTypes.some((type) => type.id === scannerType)

// // if invalid redirect back to login
if (!scannerTypeIsValid) {
  router.replace({ name: 'NotFound' })
}
</script>

<template>
  <RouterView />
  <PrintModal />
</template>
