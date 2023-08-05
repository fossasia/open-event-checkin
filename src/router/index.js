import { createRouter, createWebHistory } from 'vue-router'
import UserAuth from '@/views/UserAuth.vue'
import StationSelector from '@/views/StationSelector.vue'
import QRScannerCamera from '@/components/QRScanner/ScannerCamera.vue'
import Registration from '@/views/Registration.vue'
import RegistrationKiosk from '@/components/Registration/Kiosk/ScannerCamera.vue'
import RegistrationManual from '@/components/Registration/Manual/ScanSearch.vue'
import NotFound from '@/views/NotFound.vue'
import AuthTemplate from '@/AuthTemplate.vue'
import RegistrationStats from '@/components/Registration/Manual/RegistrationStats.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'userAuth',
      component: UserAuth
    },
    {
      path: '/auth',
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
          component: Registration,
          children: [
            {
              path: 'kiosk',
              name: 'registerKiosk',
              component: RegistrationKiosk
            },
            {
              path: 'manual',
              name: 'registerHybrid',
              component: RegistrationManual
            },
          ]
        },
        {
          path: ':eventId/:stationId/scanner/:scannerType',
          name: 'scanner',
          component: QRScannerCamera
        },
        {
          path: 'statistics',
          name: 'registerStats',
          component: RegistrationStats
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

export default router
