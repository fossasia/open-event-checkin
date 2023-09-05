import AuthTemplate from '@/AuthTemplate.vue'
import CheckInCamera from '@/components/CheckIn/CheckInCamera.vue'
import CheckInStats from '@/components/CheckIn/CheckInStats.vue'
import RegistrationKiosk from '@/components/Registration/Kiosk/Overview.vue'
import RegistrationStation from '@/components/Registration/Station/Overview.vue'
import RegistrationStats from '@/components/Registration/Station/RegistrationStats.vue'
import { useLoadingStore } from '@/stores/loading'
import CheckInView from '@/views/CheckInView.vue'
import NotFound from '@/views/NotFound.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import SelectStation from '@/views/SelectStation.vue'
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
          path: 'select-station',
          name: 'selectStation',
          component: SelectStation
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
          name: 'checkIn',
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
