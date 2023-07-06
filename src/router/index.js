import { createRouter, createWebHistory } from 'vue-router'
import QRScanner from '@/views/QRScanner.vue'
import UserAuth from '@/views/UserAuth.vue'
import StationSelector from '@/views/StationSelector.vue'
import QRScannerCamera from '@/components/QRScanner/ScannerCamera.vue'
import QRScannedStats from '@/components/QRScanner/ScannedStats.vue'
import Registration from '@/views/Registration.vue'
import RegistrationScannerCamera from '@/components/Registration/ScannerCamera.vue'
import RegistrationManualTemplate from '@/components/Registration/Manual/BaseTemplate.vue'
import RegistrationStats from '@/components/Registration/Manual/RegistrationStats.vue'
import RegistrationScanSearch from '@/components/Registration/Manual/ScanSearch.vue'
import RegistrationSearch from '@/components/Registration/Manual/SearchAttendee.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'userAuth',
      component: UserAuth
    },
    {
      path: '/station-selector',
      name: 'stationSelector',
      component: StationSelector
    },
    {
      path: '/:eventId/registration/:registrationType',
      name: 'registration',
      redirect: { name: 'registerScan' },
      component: Registration,
      children: [
        {
          path: 'kiosk',
          name: 'registerScan',
          component: RegistrationScannerCamera
        },
        // out of kiosk mode
        {
          path: 'manual',
          name: 'registerManual',
          redirect: { name: 'registerSearch' },
          component: RegistrationManualTemplate,
          children: [
            {
              path: 'search',
              name: 'registerSearch',
              component: RegistrationSearch
            },
            {
              path: 'hybrid',
              name: 'registerHybrid',
              component: RegistrationScanSearch
            },
            {
              path: 'stats',
              name: 'registerStats',
              component: RegistrationStats
            }
          ]
        }
      ]
    },
    {
      path: '/:eventId/scanner/:scannerType',
      name: 'scanner',
      redirect: { name: 'scannerCamera' },
      component: QRScanner,
      children: [
        {
          path: 'camera',
          name: 'scannerCamera',
          component: QRScannerCamera
        },
        {
          path: 'stats',
          name: 'scannedStats',
          component: QRScannedStats
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

export default router
