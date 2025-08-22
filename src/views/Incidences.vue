<template>
  <div class="incidence-list">
    <h2>Mis Incidencias</h2>
    <button @click="logout">Cerrar Sesión</button><br><br>
    <router-link to="/generate-incidence">
      <button>Generar Nueva Incidencia</button>
    </router-link>
    <button @click="exportExcel">Exportar a Excel</button>

    <div v-if="incidences.length">
      <div v-for="i in incidences" :key="i.id" class="incidence-item">
        <h3>{{ i.type }} <span class="status" :class="i.status">{{ i.status }}</span></h3>
        <p><strong>Ubicación:</strong> {{ i.location }}</p>
        <p>{{ i.description }}</p>
        <p v-if="i.attachment">
          <a :href="getFileUrl(i.attachment)" target="_blank">Ver adjunto</a>
        </p>
        <small>Registrado el: {{ formatDate(i.created_at) }}</small>
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
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const incidences = ref([])
const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  try {
    const res = await axios.get('/api/reports', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
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
  return `http://127.0.0.1:8000/storage/${path}`
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString()
}

// --- Función para exportar a Excel ---
const exportExcel = () => {
  const data = incidences.value.map(r => ({
    Lugar: r.location,
    Item: r.type.split(' - ')[0] || '',
    Detalle: r.type.split(' - ')[1] || '',
    Problema: r.type.split(' - ')[2] || '',
    Observación: r.description,
    Fecha: formatDate(r.created_at),
    Estado: r.status,
    Adjunto: r.attachment ? getFileUrl(r.attachment) : ''
  }))

  const worksheet = XLSX.utils.json_to_sheet(data, { header: ["Lugar","Item","Detalle","Problema","Observación","Fecha","Estado","Adjunto"] })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Incidencias")

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'Incidencias.xlsx')
}
</script>

<style scoped>
.incidence-list {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}
.incidence-item {
  background: #f9f9f9;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 5px solid #1d4ed8;
  color: #000;
}
.status {
  font-size: 0.9rem;
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.status.pending { background: #fde68a; }
.status.in_review { background: #bfdbfe; }
.status.resolved { background: #bbf7d0; }
button { margin-top: 1rem; padding: 0.7rem 1.5rem; background-color: #1d4ed8; color: white; border: none; border-radius: 4px; }
</style>
