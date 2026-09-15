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
    <h1>Notifications</h1>
    <p v-if="!loggedUser.token">Please login to view notifications.</p>
    <ul v-else>
      <li v-for="notification in notifications" :key="notification._id">
        <span :style="{ fontWeight: notification.read ? 'normal' : 'bold' }">{{ notification.message }}</span>
        <button v-if="!notification.read" @click="markRead(notification)">Mark read</button>
      </li>
    </ul>
  </main>
</template>
