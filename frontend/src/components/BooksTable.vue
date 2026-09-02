<script setup>
import { ref, onMounted, watch } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { books, fetchBooks, createBook, deleteBook } from '../states/books.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`
const BOOKS_URL = API_URL+'/books'
const LENDINGS_URL = API_URL+'/booklendings'



const title = ref('')
const warningMessage = ref('')



onMounted( () => {
  fetchBooks() // fetch on init
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  warningMessage.value = ''
})



function createBookButton() {
  if (title.value=='') {
    warningMessage.value = 'Please specify a valid title!'
    return;
  }
  warningMessage.value = ''
  createBook(title.value).catch( err => console.error(err) );
};

function deleteBookButton(book) {
  deleteBook(book).catch( err => console.error(err) );
};

function takeBook(book) {
  if (!loggedUser.token) {
    warningMessage.value = 'Please login to take a book!'
    return;
  }
  warningMessage.value = ''

  fetch(LENDINGS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { student: loggedUser.self, book: book.self } ),
    })
    .then((resp) => {
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
};

</script>



<template>
  <form>
    <span>Insert a new book</span>
    <br />
    <input v-model="title" />
    <button type="button" @click="createBookButton">Create book {{title}}</button>
    <br />
    <span style="color: red"> {{warningMessage}} </span>
  </form>
  <h1>Books:</h1>
  <ul>
    <li v-for="book in books.value" :key="book.self">
      <a :href="HOST+book.self">{{book.title}}</a>
      -
      <button @click="takeBook(book)">TAKE</button>
      -
      <button @click="deleteBookButton(book)">DELETE</button>
    </li>
  </ul>
</template>
