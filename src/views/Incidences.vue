<template>
  <div class="incidence-list">
    <h2>Mis Incidencias</h2>
    <button @click="logout">Cerrar Sesión</button><br></br><br></br>

    <router-link to="/generate-incidence">
      <button>Generar Nueva Incidencia</button>
    </router-link>

    <div v-if="incidences.length">
      <div v-for="i in incidences" :key="i.id" class="incidence-item">
        <h3>
          {{ i.type }}
          <span class="status" :class="i.status">{{ i.status }}</span>
        </h3>
        >
        <p><strong>Ubicación:</strong> {{ i.location }}</p>
        <p>{{ i.description }}</p>
        <p v-if="i.attachment">
          <a :href="getFileUrl(i.attachment)" target="_blank">Ver adjunto</a>
        </p>
        <small>Registrado el: {{ formateDate(i.created_at) }}</small>
      </div>
    </div>
    <p v-else>No hay incidencias registradas.</p>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const incidences = ref([])
const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  try {
    const res = await axios.get('/api/reports')
    incidences.value = res.data
  } catch (error) {
    console.error('Error al obtener reportes:', error)
    router.push('/login')
  }
})

const logout = async () => {
  await userStore.logout()
  router.push('/login')
}

const getFileUrl = (path) => {
  return 'http://127.0.0.1:8000/storage/${path}'
}

const formateDate = (datetime) => {
  return new Date(datetime).toLocaleDateString()
}

</script>
<style scoped>
.incidence-list {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
  color: #000;
}
.logout-button {
  background-color: #e11d48;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  margin-bottom: 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.incidence-item {
  background: #f9f9f9;
  color: #000;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 5px solid #1d4ed8;
}



.status {
  font-size: 0.9rem;
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.status.pending {
  background: #fde68a;
}
.status.in_review {
  background: #bfdbfe;
}
.status.resolved {
  background: #bbf7d0;
}
</style>
