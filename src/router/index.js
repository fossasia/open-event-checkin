import { createRouter, createWebHistory } from 'vue-router'
import QRScannerView from '@/views/QRScannerView.vue'
import HomeView from '@/views/HomeView.vue'
import StationSelectorView from '@/views/StationSelectorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/type',
      name: 'stationSelector',
      component: StationSelectorView
    },
    {
      path: '/scanner',
      name: 'qrCodeScanner',
      component: QRScannerView
    }
  ]
})

export default router
