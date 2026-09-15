<script setup>
import { onMounted, ref } from 'vue'
import { loggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const users = ref([])
const errorMessage = ref('')
const loading = ref(false)

async function fetchUsers() {
  const response = await fetch(`${HOST}/api/v1/students`, {
    headers: { 'x-access-token': loggedUser.token }
  })
  if (!response.ok) {
    errorMessage.value = 'Unable to load registered users.'
    return
  }
  users.value = await response.json()
}

async function deleteUser(user) {
  if (!window.confirm(`Delete ${user.email} and all their lendings?`)) return
  loading.value = true
  try {
    const response = await fetch(`${HOST}${user.self}`, {
      method: 'DELETE',
      headers: { 'x-access-token': loggedUser.token }
    })
    if (!response.ok) {
      let details = ''
      try {
        const body = await response.json()
        details = body.error || body.message || ''
      } catch {
        // The API may intentionally return an empty body for some errors.
      }
      throw new Error(details || `Unable to delete user (HTTP ${response.status}).`)
    }
    await fetchUsers()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<template>
  <main>
    <div class="page-heading"><div><p class="eyebrow">Workspace / amministrazione</p><h1>Utenti registrati</h1><p>Gestisci gli account che utilizzano la biblioteca.</p></div><span class="status-badge">{{ users.length }} account</span></div>
    <p class="status-message" v-if="errorMessage">{{ errorMessage }}</p>
    <section class="surface-panel">
    <p class="empty-state" v-if="users.length === 0">Nessun utente registrato.</p>
    <ul class="data-list list-reset" v-else>
      <li v-for="user in users" :key="user.self">
        <div><strong>{{ user.email }}</strong><div class="muted">Ruolo: {{ user.role }}</div></div>
        <button class="button-danger" :disabled="loading || user.id === loggedUser.id" @click="deleteUser(user)">Elimina account</button>
      </li>
    </ul>
    </section>
  </main>
</template>
