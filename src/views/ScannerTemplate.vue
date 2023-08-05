<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useTypeSelectorStore } from '@/stores/typeSelector'

const router = useRouter()
const route = useRoute()
const typeSelectorStore = useTypeSelectorStore()

// // check validity of eventId and registration type
const eventId = route.params.eventId
const scannerType = route.params.scannerType

// // check if eventId and registrationType are valid
if (!eventId || !scannerType) {
  router.replace({ name: 'NotFound' })
}

// // check if registrationType is valid
// // loop through array if registrationType is in object id
const scannerTypes = typeSelectorStore.stationTypes
const scannerTypeIsValid = scannerTypes.some((type) => type.id === scannerType)

// // if invalid redirect back to login
if (!scannerTypeIsValid) {
  router.replace({ name: 'NotFound' })
}
</script>

<template>
  <div class="m-6">
    <RouterView />
  </div>
</template>