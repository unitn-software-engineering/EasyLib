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
    <div class="page-heading"><div><p class="eyebrow">Servizi locali</p><h1>Biblioteche</h1><p>Trova sedi, indirizzi e orari nel dataset locale.</p></div></div>
    <section class="surface-panel">
    <form class="toolbar" @submit.prevent="search">
      <input id="municipality" name="municipality" v-model="municipality" placeholder="Cerca per comune" aria-label="Cerca per comune" />
      <button class="button-primary" type="submit">Cerca biblioteche</button>
    </form>
    <p class="empty-state" v-if="searched && libraries.length === 0">Nessuna biblioteca trovata.</p>
    <ul class="data-list list-reset">
      <li v-for="library in libraries" :key="library.id">
        <div><strong>{{ library.name }}</strong><div class="muted">{{ library.address }} · {{ library.openingHours }}</div></div>
        <span class="muted">{{ library.contacts }}</span>
      </li>
    </ul>
    </section>
  </main>
</template>
