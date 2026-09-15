<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

const email = ref('')
const password = ref('')
const errorMessage = ref('')

// const loggedUser = ref({})
// const loggedUser = defineProps(['loggedUser'])
const emit = defineEmits(['login'])

function login() {
    errorMessage.value = ''
    fetch(API_URL+'/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email.value, password: password.value } ),
    })
    .then(async (resp) => {
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.message || 'Authentication failed')
        return data
    })
    .then(function(data) {
        setLoggedUser(data)
        // loggedUser.token = data.token;
        // loggedUser.email = data.email;
        // loggedUser.id = data.id;
        // loggedUser.self = data.self;
        emit('login', loggedUser)
        return;
    })
    .catch(error => { errorMessage.value = error.message })

};


function logout() {
  clearLoggedUser()
}

</script>

<template>
  <form>
    <span v-if="loggedUser.token" class="logged-in-user">
      <span>Connesso come <strong>{{loggedUser.email}}</strong></span>
      <button class="button-quiet" type="button" @click="logout">Esci</button>
    </span>
    
    <span v-if="!loggedUser.token">
      <input name="email" type="email" autocomplete="username" v-model="email" />
      <input name="password" type="password" autocomplete="current-password" v-model="password" />
      <button class="button-primary" type="button" @click="login">Accedi</button>
      <span v-if="errorMessage" class="status-message">{{ errorMessage }}</span>
    </span>
  </form>
</template>
<style scoped>
.logged-in-user { display: flex; align-items: center; gap: 10px; }
.logged-in-user strong { color: var(--color-heading); }
.status-message { margin: 0 0 0 5px; font-size: 11px; }
@media (max-width: 780px) { .auth-area form { flex-wrap: wrap; } .auth-area input { width: min(150px, 34vw); } }
</style>
