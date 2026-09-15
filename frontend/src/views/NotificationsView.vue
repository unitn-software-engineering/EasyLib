<script setup>
import { onMounted, ref } from 'vue'
import { loggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const notifications = ref([])

async function fetchNotifications() {
  if (!loggedUser.token) return
  const response = await fetch(`${HOST}/api/v1/notifications`, {
    headers: { 'x-access-token': loggedUser.token }
  })
  if (response.ok) notifications.value = await response.json()
}

async function markRead(notification) {
  await fetch(`${HOST}/api/v1/notifications/${notification._id}/read`, {
    method: 'PATCH', headers: { 'x-access-token': loggedUser.token }
  })
  await fetchNotifications()
}

onMounted(fetchNotifications)
</script>

<template>
  <main>
    <div class="page-heading"><div><p class="eyebrow">Account</p><h1>Notifiche</h1><p>Aggiornamenti su prestiti, restituzioni e proroghe.</p></div></div>
    <section class="surface-panel">
    <p class="empty-state" v-if="!loggedUser.token">Accedi per visualizzare le notifiche.</p>
    <ul class="data-list list-reset" v-else>
      <li v-for="notification in notifications" :key="notification._id">
        <span :class="{ 'notification-unread': !notification.read }">{{ notification.message }}</span>
        <button class="button-quiet" v-if="!notification.read" @click="markRead(notification)">Segna come letta</button>
      </li>
    </ul>
    </section>
  </main>
</template>
<style scoped>.notification-unread { color: var(--color-heading); font-weight: 750; }</style>
