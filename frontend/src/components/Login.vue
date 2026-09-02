<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

const email = ref('mario.rossi@unitn.com')
const password = ref('123')

// const loggedUser = ref({})
// const loggedUser = defineProps(['loggedUser'])
const emit = defineEmits(['login'])

function login() {
    fetch(API_URL+'/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email.value, password: password.value } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        setLoggedUser(data)
        // loggedUser.token = data.token;
        // loggedUser.email = data.email;
        // loggedUser.id = data.id;
        // loggedUser.self = data.self;
        emit('login', loggedUser)
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};


function logout() {
  clearLoggedUser()
}

</script>

<template>
  <form>
    <span v-if="loggedUser.token">
      Welcome <a :href="HOST+'/'+loggedUser.self">{{loggedUser.email}}</a>
      <button type="button" @click="logout">LogOut</button>
    </span>
    
    <span v-if="!loggedUser.token">
      <input name="email" v-model="email" />
      <input name="password" v-model="password" />
      <button type="button" @click="login">LogIn</button>
    </span>
  </form>
</template>
