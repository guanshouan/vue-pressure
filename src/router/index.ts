import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import LayoutView from '../views/LayoutView.vue'
import SystemView from '../views/SystemView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutView,
      children: [
        {
          path: '',
          component: HomeView
        },
        {
          path: '/system1',
          component: HomeView
        },
        {
          path: '/system2',
          component: SystemView
        }
      ]
    },
    {
      path: '/home',
      component: HomeView
    },
    {
      path: '/history',
      component: HistoryView
    }
  ]
})

export default router
