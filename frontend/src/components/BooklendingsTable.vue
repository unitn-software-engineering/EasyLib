<script setup>
import { ref, onMounted, watch } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { fetchBooks } from '../states/books.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`
const LENDINGS_URL = API_URL+'/booklendings'

const booklendings = ref([])

onMounted( () => {
  fetchBooks()
  fetchData()
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  fetchBooks()
  fetchData()
})

async function fetchData() {
  if (!loggedUser.token) {
    booklendings.value = []
    return;
  }
  const url = new URL(API_URL + '/booklendings')
  url.searchParams.set('token', loggedUser.token)
  if (loggedUser.role !== 'operator') url.searchParams.set('studentId', loggedUser.id)
  const response = await fetch(url)
  booklendings.value = response.ok ? await response.json() : []
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(new Date(value))
}


async function deleteLending(lending) {
  fetch(HOST+lending.self, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token }
  })
  .then(() => {
    fetchData();
  })
  .catch( error => console.error(error) );
};


</script>

<template>
  <p class="muted lending-intro" v-if="loggedUser.token && loggedUser.role === 'operator'">Vista completa: prestiti di tutti gli utenti.</p>
  <p class="muted lending-intro" v-else-if="loggedUser.token">I tuoi prestiti, {{loggedUser.email}}.</p>
  <p class="empty-state surface-panel" v-if="!loggedUser.token">Accedi per visualizzare i prestiti.</p>
  <p class="empty-state surface-panel" v-else-if="booklendings.length === 0">Nessun prestito trovato.</p>
  <div class="surface-panel responsive-table" v-else>
  <table>
    <thead>
      <tr>
        <th>Book</th>
        <th>User</th>
        <th>Borrowed</th>
        <th>Due</th>
        <th>Status</th>
        <th>Returned</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="lending in booklendings" :key="lending.self">
        <td><a :href="HOST + lending.book?.self">{{ lending.book?.title || 'Book no longer available' }}</a></td>
        <td>{{ lending.student?.email || 'User no longer available' }}</td>
        <td>{{ formatDate(lending.start_date) }}</td>
        <td>{{ formatDate(lending.end_date) }}</td>
        <td><span :class="['status-badge', { returned: lending.status === 'returned' }]">{{ lending.status === 'returned' ? 'Restituito' : 'Attivo' }}</span></td>
        <td>{{ formatDate(lending.returnedAt) }}</td>
        <td>
          <button v-if="lending.status !== 'returned'" @click="deleteLending(lending)">Return</button>
          <span class="muted" v-else>Archiviato</span>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
<style scoped>.lending-intro { margin: -14px 0 18px; }</style>
