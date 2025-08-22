import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/api/login', credentials)
        this.token = response.data.access_token
        localStorage.setItem('auth_token', this.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (error) {
        console.error('Error en login:', error.response?.data || error)
        throw error
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const response = await api.get('/api/user', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch (error) {
        console.error('Error al obtener usuario:', error.response?.data || error)
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      delete api.defaults.headers.common['Authorization']
    }
  }
})
