import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from '@/api/axios'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')


const userStore = useUserStore(pinia)
if (localStorage.getItem('auth_token')) {
  userStore.token = localStorage.getItem('auth_token')
  api.defaults.headers.common['Authorization'] = `Bearer ${userStore.token}`
}
