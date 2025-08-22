import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Incidences from '@/views/Incidences.vue'
import GenerateIncidence from '@/components/GenerateIncidence.vue'
import CreateUser from '@/components/CreateUser.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/incidences', component: Incidences, meta: { requiresAuth: true } },
  { path: '/generate-incidence', component: GenerateIncidence, meta: { requiresAuth: true } },
  { path: '/create-user', component: CreateUser, meta: { requiresAuth: true } },

  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
