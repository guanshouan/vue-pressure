import { createRouter, createWebHistory } from 'vue-router'
import BipapSystem from '../views/BipapSystem.vue'
import HistoryView from '../views/HistoryView.vue'
import LayoutView from '../views/LayoutView.vue'
import CpapSystem from '../views/CpapSystem.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutView,
      children: [
        {
          path: '',
          component: CpapSystem
        },
        {
          path: '/CPAP',
          name: 'CPAP',
          component: CpapSystem
        },
        {
          path: '/BIPAP',
          name: 'BIPAP',
          component: BipapSystem
        }
      ]
    },
    {
      path: '/home',
      component: BipapSystem
    },
    {
      path: '/history',
      component: HistoryView
    }
  ]
})

export default router
