<script setup>
import { ref, onMounted, watch } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { books, fetchBooks, createBook, deleteBook } from '../states/books.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`
const BOOKS_URL = API_URL+'/books'
const LENDINGS_URL = API_URL+'/booklendings'

const booklendings = ref([])

onMounted( () => {
  fetchBooks()
  fetchData()
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  fetchBooks()
  fetchData()
})

async function fetchData() {
  if (!loggedUser.token) {
    booklendings.value = []
    return;
  }
  const url = API_URL+'/booklendings?studentId=' + loggedUser.id + '&token=' + loggedUser.token
  booklendings.value = await (await fetch(url)).json()
}


async function deleteLending(lending) {
  fetch(HOST+lending.self, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token }
  })
  .then(() => {
    fetchData();
  })
  .catch( error => console.error(error) );
};


</script>

<template>
  <span v-if="loggedUser.token"> Here are your booklendings, {{loggedUser.email}}: </span>
  <span v-if="!loggedUser.token" style="color: red"> 'Please login to visualize booklendings!' </span>
  <ul>
    <li v-for="lending in booklendings" :key="lending.self">
      <a :href="HOST+lending.book">{{ lending.book.title }}</a>
      -
      <button @click="deleteLending(lending)">RETURN {{lending.self}}</button>
    </li>
  </ul>
</template>
