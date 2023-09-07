<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useStationsStore } from '@/stores/stations'
import PrintModal from '@/components/Modals/PrintModal.vue'

const router = useRouter()
const route = useRoute()
const stationsStore = useStationsStore()

// // check validity of eventId and registration type
const eventId = route.params.eventId
const registrationType = route.params.registrationType

// // check if eventId and registrationType are valid
if (!eventId || !registrationType) {
  router.replace({ name: 'NotFound' })
}

// // check if registrationType is valid
// // loop through array if registrationType is in object id
const registrationTypes = stationsStore.stationTypes
const registrationTypeIsValid = registrationTypes.some((type) => type.id === registrationType)

// // if invalid redirect back to login
if (!registrationTypeIsValid) {
  router.replace({ name: 'NotFound' })
}
</script>
<template>
  <RouterView />
  <PrintModal />
</template>
