import { useEventsStore } from '@/stores/events'
import { usePasswordModalStore } from '@/stores/passwordModal'
import { useStationsStore } from '@/stores/stations'
import {
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { defineStore } from 'pinia'
import { computed, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useNavbarStore = defineStore('navbar', () => {
  const route = useRoute()
  const router = useRouter()
  const eventsStore = useEventsStore()
  const stationsStore = useStationsStore()
  const passwordModalStore = usePasswordModalStore()

  // watch for router change and call fetchNavbarTitle
  watch(
    () => route.params,
    async() => {
      await fetchNavbarTitle()
    }
  )
  
  onBeforeMount(async() => {
    await router.isReady()
    await fetchNavbarTitle()
  })


  const station = computed(() => {
    const sn = stationsStore.eventStations.find(
      // provide base for parse Int
      (s) => s.id === parseInt(route.params.stationId, 10)
    )
    // if undefined return false
    if (!sn) {
      return false
    }

    return sn
  })

  async function fetchNavbarTitle(){
    if (route.params.eventId && route.params.stationId) {
      // check if event name is empty
      if (!eventsStore.eventName) {
        // event name empty so call for event name
        await eventsStore.getEventName(route.params.eventId)
      }

      if (!station || !stationsStore.eventStations.length > 0) {
        await stationsStore.getStations(route.params.eventId)
      }

    }
  }

  const navbarTitle = computed(() => {
    // check if event id and station id exist in url params
    if (route.params.eventId && route.params.stationId) {
      if (!station.value) {
        return ''
      }

      return `${eventsStore.eventName} - ${station.value.attributes['station-name']}`
    }
    return ''
  })

  // only if parent route is named auth
  const loadMenu = computed(() => {
    return route.matched.find((r) => r.name === 'auth')
  })

  // authenticated and not station page
  const stationNavigation = computed(() => {
    if (route.name !== 'selectStation') {
      let obj = {
        icon: MagnifyingGlassIcon,
        name: 'Search',
        customClass: 'text-body hover:bg-body-light',
        action: () => {
          if (route.params.registrationType) {
            router.push({ name: 'registerStation' })
          }
        }
      }

      let arr = [
        {
          icon: ComputerDesktopIcon,
          name: 'Station',
          customClass: 'text-body hover:bg-body-light',
          action: () => {
            if (route.params.registrationType) {
              router.push({ name: 'registerKiosk' })
            }
            if (route.params.scannerType) {
              router.push({ name: 'checkInCamera' })
            }
          }
        },
        {
          icon: ChartBarIcon,
          name: 'Stats',
          customClass: 'text-body hover:bg-body-light',
          action: () => {
            if (route.params.registrationType) {
              router.push({ name: 'registerStats' })
            }
            if (route.params.scannerType) {
              router.push({ name: 'checkInStats' })
            }
          }
        }
      ]

      if (route.params.registrationType) {
        // append obj in front of array
        arr.unshift(obj)
      }

      return arr
    } else {
      return []
    }
  })

  const publicNavigation = computed(() => {
    return [
      {
        icon: ArrowLeftOnRectangleIcon,
        name: 'Sign out',
        customClass: 'text-danger hover:bg-danger-light font-semibold',
        action: () => {
          if (route.params.registrationType || route.params.scannerType) {
            passwordModalStore.showPasswordModal = true
          } else {
            router.push({ name: 'userAuth' })
          }
        }
      }
    ]
  })

  return { loadMenu, navbarTitle, stationNavigation, publicNavigation }
})
