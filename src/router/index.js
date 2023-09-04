import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import AuthTemplate from '@/AuthTemplate.vue'
import UserAuth from '@/views/UserAuth.vue'
import StationSelector from '@/views/StationSelector.vue'
import CheckInStats from '@/components/CheckIn/CheckInStats.vue'
import CheckInCamera from '@/components/CheckIn/CheckInCamera.vue'
import RegistrationKiosk from '@/components/Registration/Kiosk/Overview.vue'
import RegistrationStats from '@/components/Registration/Station/RegistrationStats.vue'
import RegistrationStation from '@/components/Registration/Station/Overview.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import CheckInView from '@/views/CheckInView.vue'
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
          component: RegistrationView,
          children: [
            {
              path: 'kiosk',
              name: 'registerKiosk',
              component: RegistrationKiosk
            },
            {
              path: 'station',
              name: 'registerStation',
              component: RegistrationStation
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
          path: ':eventId/:stationId/checkin/:scannerType',
          name: 'checkin',
          redirect: { name: 'checkInCamera' },
          component: CheckInView,
          children: [
            {
              path: 'station',
              name: 'checkInCamera',
              component: CheckInCamera
            },
            {
              path: 'stats',
              name: 'checkInStats',
              component: CheckInStats
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
