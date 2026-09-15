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
    <h1>Registered users</h1>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p v-else-if="users.length === 0">No users registered.</p>
    <ul v-else>
      <li v-for="user in users" :key="user.self">
        <strong>{{ user.email }}</strong> — {{ user.role }}
        <button :disabled="loading || user.id === loggedUser.id" @click="deleteUser(user)">Delete</button>
      </li>
    </ul>
  </main>
</template>
