import { createRouter, createWebHistory } from 'vue-router'
import QRScanner from '@/views/QRScanner.vue'
import Login from '@/views/Login.vue'
import StationSelector from '@/views/StationSelector.vue'
import ScannerCamera from '@/components/QRScanner/ScannerCamera.vue'
import ScannedStats from '@/components/QRScanner/ScannedStats.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/station-selector',
      name: 'stationSelector',
      component: StationSelector
    },
    {
      path: '/scanner/:scannerType',
      name: 'scanner',
      redirect: { name: 'scannerCamera' },
      component: QRScanner,
      children: [
        {
          path: 'camera',
          name: 'scannerCamera',
          component: ScannerCamera
        },
        {
          path: 'stats',
          name: 'scannedStats',
          component: ScannedStats
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

export default router
