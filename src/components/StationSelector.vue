<script setup>
import { onBeforeMount } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useStationsStore } from '@/stores/stations'
import { useStationSelectorStore } from '@/stores/stationSelector'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import ListboxSelector from '@/components/Common/ListboxSelector.vue'
import StandardButton from '@/components/Common/StandardButton.vue'

// stores
const eventsStore = useEventsStore()
const stationsStore = useStationsStore()
const stationSelectorStore = useStationSelectorStore()
const loadingStore = useLoadingStore()
loadingStore.contentLoading()

// router
const router = useRouter()

onBeforeMount(async () => {
  await eventsStore.getEvents().catch(() => {
    // if error, kick user to login page
    router.replace({
      name: 'userAuth'
    })
  })
  loadingStore.contentLoaded()
})

async function submitForm() {
  loadingStore.contentLoading()
  if (stationSelectorStore.isRegistrationStations) {
    // if create new station is selected, create new station

    if (stationSelectorStore.selectedStation.id === 'create-new') {
      const payload = {
        data: {
          attributes: {
            'station-name': stationSelectorStore.newStationName,
            //  registration | daily | check in | check out
            'station-type':
              stationSelectorStore.selectedType.id === 'check-in-daily' ? 'daily' : 'registration'
          },
          relationships: {
            event: {
              data: {
                type: 'event',
                id: stationSelectorStore.selectedEvent.id
              }
            }
          },
          type: 'station'
        }
      }

      await stationSelectorStore.createStation(payload)
    }

    const obj = {
      name: stationSelectorStore.selectedType.href,
      params: {
        eventId: stationSelectorStore.selectedEvent.id,
        registrationType: stationSelectorStore.selectedType.id,
        stationId: stationSelectorStore.selectedStation.id
      }
    }

    // clear store before redirect
    stationSelectorStore.$reset()
    router.push(obj)
  } else {
    // front end to lock only one station for checkin and checkout
    // station, check if station exist else create
    const payload = {
      data: {
        attributes: {
          'station-name': stationSelectorStore.selectedMicrolocation.name,
          //  check in | check out
          'station-type':
            stationSelectorStore.selectedType.id === 'check-in' ? 'check in' : 'check out'
        },
        relationships: {
          event: {
            data: {
              type: 'event',
              id: stationSelectorStore.selectedEvent.id
            }
          },
          microlocation: {
            data: {
              id: stationSelectorStore.selectedMicrolocation.id,
              type: 'microlocation'
            }
          }
        },
        type: 'station'
      }
    }

    if (stationSelectorStore.selectedType.id === 'check-in') {
      if (stationsStore.checkInStations.length < 1) {
        // means station not created
        await stationSelectorStore.createStation(payload)
      } else {
        // set first station as selected
        stationSelectorStore.$patch({
          selectedStation: {
            id: stationsStore.checkInStations[0].id,
            name: stationsStore.checkInStations[0].name
          }
        })
      }
    }

    if (stationSelectorStore.selectedType.id === 'checkout') {
      if (stationsStore.checkOutStations.length < 1) {
        // means station not created
        await stationSelectorStore.createStation(payload)
      } else {
        // set first station as selected
        stationSelectorStore.$patch({
          selectedStation: {
            id: stationsStore.checkOutStations[0].id,
            name: stationsStore.checkOutStations[0].name
          }
        })
      }
    }

    const obj = {
      name: stationSelectorStore.selectedType.href,
      params: {
        eventId: stationSelectorStore.selectedEvent.id,
        // stationId is microlocation
        stationId: stationSelectorStore.selectedStation.id,
        scannerType: stationSelectorStore.selectedType.id
      }
    }

    // clear store before redirect
    stationSelectorStore.$reset()
    router.push(obj)
  }
}
</script>

<template>
  <div class="-mt-16 flex h-screen flex-col justify-center">
    <div class="my-auto sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center">Select Event</h2>
      <form class="mt-10 space-y-3" @submit.prevent="submitForm">
        <ListboxSelector
          :select-text="'Select Event'"
          :label="'Event'"
          :data="eventsStore.userEvents"
          :selected-option="stationSelectorStore.selectedEvent"
          @update-selected="(n) => stationSelectorStore.$patch({ selectedEvent: n })"
        ></ListboxSelector>
        <!-- select booth type -->
        <ListboxSelector
          :select-text="'Select Type'"
          :label="'Type'"
          :data="stationsStore.stationTypes"
          :selected-option="stationSelectorStore.selectedType"
          @update-selected="(n) => stationSelectorStore.$patch({ selectedType: n })"
        ></ListboxSelector>
        <!-- allow user to select booth or give a new field to store booth -->
        <!-- for session checkin and checkout, only retrieve locations from api and not able to create new -->
        <ListboxSelector
          v-if="stationSelectorStore.isStationType"
          :select-text="'Select Station'"
          :label="'Station'"
          :data="stationSelectorStore.availableStations"
          :selected-option="stationSelectorStore.selectedStation"
          @update-selected="(n) => stationSelectorStore.$patch({ selectedStation: n })"
        ></ListboxSelector>
        <!-- allow user to select microlocation or give a new field to store microlocation -->
        <!-- for microlocation checkin and checkout, only retrieve locations from api and not able to create new -->
        <ListboxSelector
          v-if="
            !stationSelectorStore.isStationType && stationSelectorStore.isStationType !== undefined
          "
          :select-text="'Select Microlocation'"
          :label="'Microlocation'"
          :data="eventsStore.eventMicrolocations"
          :selected-option="stationSelectorStore.selectedMicrolocation"
          @update-selected="(n) => stationSelectorStore.$patch({ selectedMicrolocation: n })"
        ></ListboxSelector>

        <!-- display if create new booth is selected -->
        <div v-if="stationSelectorStore.isCreateNewStation">
          <label for="station">Station Name</label>
          <div class="mt-2">
            <input
              id="station"
              v-model="stationSelectorStore.newStationName"
              name="station"
              type="text"
              required="true"
              placeholder="Enter station name"
              class="block w-full"
            />
          </div>
        </div>

        <div>
          <StandardButton
            :disabled="!stationSelectorStore.validation"
            :type="'submit'"
            :text="'Go'"
            class="btn-primary mt-6 w-full justify-center"
          />
        </div>
      </form>
    </div>
  </div>
</template>
