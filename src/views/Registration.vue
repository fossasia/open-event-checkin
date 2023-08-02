<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useTypeSelectorStore } from '@/stores/typeSelector'

const router = useRouter()
const route = useRoute()
const typeSelectorStore = useTypeSelectorStore()

// // check validity of eventId and registration type
const eventId = route.params.eventId
const registrationType = route.params.registrationType

// // check if eventId and registrationType are valid
if (!eventId || !registrationType) {
  router.replace({ name: 'NotFound' })
}

// // check if registrationType is valid
// // loop through array if registrationType is in object id
const registrationTypes = typeSelectorStore.stationTypes
const registrationTypeIsValid = registrationTypes.some(
  (type) => type.id === registrationType
)

// // if invalid redirect back to login
if (!registrationTypeIsValid) {
  router.replace({ name: 'NotFound' })
}

</script>
<template>
  <div class="m-6">
    <RouterView />
  </div>
</template>
