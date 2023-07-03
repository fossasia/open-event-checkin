import { createRouter, createWebHistory } from 'vue-router'
import QRScannerView from '@/views/QRScannerView.vue'
import HomeView from '@/views/HomeView.vue'
import RoomView from '@/views/RoomView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/room',
      name: 'room',
      component: RoomView
    },
    {
      path: '/scanner',
      name: 'QR Code Scanner',
      component: QRScannerView
    },
  ]
})

export default router
