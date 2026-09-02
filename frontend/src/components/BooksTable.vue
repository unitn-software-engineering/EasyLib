<script setup>
import { ref, onMounted, watch } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { books, fetchBooks, createBook, deleteBook } from '../states/books.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`
const BOOKS_URL = API_URL+'/books'
const LENDINGS_URL = API_URL+'/booklendings'

const title = ref('')
const author = ref('')
const isbn = ref('')
const genre = ref('')
const year = ref('')

const searchTitle = ref('')
const searchAuthor = ref('')
const warningMessage = ref('')

onMounted(() => {
  fetchBooks() // fetch on init
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  warningMessage.value = ''
})

function applySearch() {
  fetchBooks({
    title: searchTitle.value,
    author: searchAuthor.value
  }).catch(err => console.error(err));
}

function clearSearch() {
  searchTitle.value = '';
  searchAuthor.value = '';
  fetchBooks();
}

function createBookButton() {
  if (!title.value.trim()) {
    warningMessage.value = 'Please specify a valid title!'
    return;
  }
  warningMessage.value = ''
  createBook({
    title: title.value.trim(),
    author: author.value.trim(),
    isbn: isbn.value.trim(),
    genre: genre.value.trim(),
    year: year.value ? Number(year.value) : undefined
  }).then(() => {
    title.value = '';
    author.value = '';
    isbn.value = '';
    genre.value = '';
    year.value = '';
  }).catch(err => console.error(err));
};

function deleteBookButton(book) {
  deleteBook(book).catch(err => console.error(err));
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
    body: JSON.stringify({ student: loggedUser.self, book: book.self }),
  })
  .then(() => {
    fetchBooks();
  })
  .catch(error => console.error(error));
};
</script>

<template>
  <div style="margin-bottom: 2rem;">
    <h2>🔍 Search Catalogue</h2>
    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
      <input v-model="searchTitle" placeholder="Filter by title..." @input="applySearch" />
      <input v-model="searchAuthor" placeholder="Filter by author..." @input="applySearch" />
      <button type="button" @click="clearSearch">Reset</button>
    </div>
  </div>

  <div style="margin-bottom: 2rem;">
    <h2>➕ Insert a New Book</h2>
    <form @submit.prevent="createBookButton" style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 400px;">
      <input v-model="title" placeholder="Title (required)" required />
      <input v-model="author" placeholder="Author" />
      <input v-model="isbn" placeholder="ISBN (e.g. 978-0132350884)" />
      <input v-model="genre" placeholder="Genre / Category" />
      <input v-model="year" type="number" placeholder="Publication Year" />
      <button type="button" @click="createBookButton">Create Book</button>
      <span v-if="warningMessage" style="color: red;">{{ warningMessage }}</span>
    </form>
  </div>

  <h2>📚 Books Catalogue</h2>
  <ul style="list-style-type: none; padding-left: 0;">
    <li v-for="book in books.value" :key="book.self" style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
      <strong><a :href="HOST+book.self" target="_blank">{{ book.title }}</a></strong>
      <span v-if="book.author"> &mdash; by <em>{{ book.author }}</em></span>
      <span v-if="book.year"> ({{ book.year }})</span>
      <span v-if="book.genre"> [{{ book.genre }}]</span>
      <span v-if="book.isbn"> &bull; ISBN: {{ book.isbn }}</span>
      <div style="margin-top: 0.3rem;">
        <button @click="takeBook(book)">TAKE</button>
        &nbsp;
        <button @click="deleteBookButton(book)">DELETE</button>
      </div>
    </li>
  </ul>
</template>
