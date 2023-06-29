import { createRouter, createWebHistory } from 'vue-router'
import QRScannerView from '@/views/QRScannerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'QR Code Scanner',
      component: QRScannerView
    }
  ]
})

export default router
