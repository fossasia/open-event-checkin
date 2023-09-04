import AuthTemplate from '@/AuthTemplate.vue'
import ScannedStats from '@/components/QRScanner/ScannedStats.vue'
import QRScannerCamera from '@/components/QRScanner/ScannerCamera.vue'
import RegistrationKiosk from '@/components/Registration/Kiosk/ScannerCamera.vue'
import RegistrationStats from '@/components/Registration/Manual/RegistrationStats.vue'
import RegistrationManual from '@/components/Registration/Manual/ScanSearch.vue'
import { useLoadingStore } from '@/stores/loading'
import NotFound from '@/views/NotFound.vue'
import RegistrationStation from '@/views/RegistrationStation.vue'
import ScannerTemplate from '@/views/ScannerTemplate.vue'
import StationSelector from '@/views/StationSelector.vue'
import UserAuth from '@/views/UserAuth.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'userAuth',
      component: UserAuth
    },
    {
      path: '/panel',
      name: 'auth',
      component: AuthTemplate,
      children: [
        {
          path: 'station-selector',
          name: 'stationSelector',
          component: StationSelector
        },
        {
          path: ':eventId/registration/:registrationType/:stationId',
          name: 'registration',
          redirect: { name: 'registerKiosk' },
          component: RegistrationStation,
          children: [
            {
              path: 'kiosk',
              name: 'registerKiosk',
              component: RegistrationKiosk
            },
            {
              path: 'search',
              name: 'registerHybrid',
              component: RegistrationManual
            },
            {
              path: 'stats',
              name: 'registerStats',
              component: RegistrationStats
            }
          ]
        },
        {
          // stationId = microlocation over here
          path: ':eventId/:stationId/scanner/:scannerType',
          name: 'scanner',
          redirect: { name: 'scannerCamera' },
          component: ScannerTemplate,
          children: [
            {
              path: 'camera',
              name: 'scannerCamera',
              component: QRScannerCamera
            },
            {
              path: 'stats',
              name: 'scannerStats',
              component: ScannedStats
            }
          ]
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.contentLoading()
  next()
})

export default router
