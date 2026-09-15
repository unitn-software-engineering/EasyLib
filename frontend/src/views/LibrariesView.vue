<script setup>
import { onMounted, ref } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const municipality = ref('')
const libraries = ref([])
const searched = ref(false)

async function search() {
  const url = new URL(`${HOST}/api/v1/libraries`)
  if (municipality.value.trim()) url.searchParams.set('municipality', municipality.value.trim())
  const response = await fetch(url)
  libraries.value = await response.json()
  searched.value = true
}

onMounted(search)
</script>

<template>
  <main>
    <h1>Library search</h1>
    <form @submit.prevent="search">
      <input v-model="municipality" placeholder="Municipality" />
      <button type="submit">Search</button>
    </form>
    <p v-if="searched && libraries.length === 0">No libraries found.</p>
    <ul>
      <li v-for="library in libraries" :key="library.id">
        <strong>{{ library.name }}</strong> — {{ library.address }}<br />
        {{ library.openingHours }} · {{ library.contacts }}
      </li>
    </ul>
  </main>
</template>
