<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser, setLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = `${HOST}/api/v1`
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const googleLoginBtn = ref(null)
const emit = defineEmits(['login'])

async function myLogin(googleToken) {
  try {
    const response = await fetch(`${API_URL}/authentications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleToken })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Google authentication failed')
    setLoggedUser(data)
    emit('login', loggedUser)
  } catch (error) {
    console.error(error)
  }
}

function handleCredentialResponse(response) {
  if (response.credential) myLogin(response.credential)
}

onMounted(() => {
  if (!GOOGLE_CLIENT_ID) return

  const initializeGoogle = () => {
    if (!window.google?.accounts?.id || !googleLoginBtn.value) return
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    })
    window.google.accounts.id.renderButton(googleLoginBtn.value, {
      text: 'signin_with',
      size: 'large',
      width: 220,
      theme: 'outline',
      logo_alignment: 'left'
    })
  }

  if (window.google?.accounts?.id) {
    initializeGoogle()
    return
  }

  const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
  if (existingScript) {
    existingScript.addEventListener('load', initializeGoogle, { once: true })
    return
  }

  const googleScript = document.createElement('script')
  googleScript.src = 'https://accounts.google.com/gsi/client'
  googleScript.async = true
  googleScript.defer = true
  googleScript.addEventListener('load', initializeGoogle, { once: true })
  document.head.appendChild(googleScript)
})
</script>

<template>
  <div ref="googleLoginBtn" aria-label="Accedi con Google"></div>
</template>

<style scoped>
:deep(iframe) { max-width: 100%; }
</style>
