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
    <span v-if="loggedUser.token">
      Welcome <a :href="HOST+loggedUser.self">{{loggedUser.email}}</a> ({{loggedUser.role}})
      <button type="button" @click="logout">LogOut</button>
    </span>
    
    <span v-if="!loggedUser.token">
      <input name="email" type="email" autocomplete="username" v-model="email" />
      <input name="password" type="password" autocomplete="current-password" v-model="password" />
      <button type="button" @click="login">LogIn</button>
      <span v-if="errorMessage" style="color: red;">{{ errorMessage }}</span>
    </span>
  </form>
</template>
