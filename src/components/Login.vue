<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Iniciar Sesión</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  try {
    await userStore.login({ email: email.value, password: password.value })
    await userStore.fetchUser()
    router.push('/generate-incidence')
  } catch (error) {
    alert('Login Fallido. Revisa tus credenciales.')
  }
}
</script>
