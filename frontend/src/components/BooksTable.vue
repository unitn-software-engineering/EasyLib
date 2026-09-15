<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
const bookList = computed(() => Array.isArray(books.value) ? books.value : [])

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
  <div class="surface-panel books-panel">
    <div class="toolbar">
      <input v-model="searchTitle" placeholder="Cerca per titolo" aria-label="Cerca per titolo" @input="applySearch" />
      <input v-model="searchAuthor" placeholder="Cerca per autore" aria-label="Cerca per autore" @input="applySearch" />
      <button type="button" @click="clearSearch">Azzera filtri</button>
    </div>

  <div v-if="loggedUser.role === 'operator'" class="book-create">
    <div><p class="eyebrow">Operatore</p><h2>Aggiungi un libro</h2><p class="muted">Inserisci i dati bibliografici nel catalogo.</p></div>
    <form @submit.prevent="createBookButton">
      <input v-model="title" placeholder="Titolo (obbligatorio)" required />
      <input v-model="author" placeholder="Autore" />
      <input v-model="isbn" placeholder="ISBN" />
      <input v-model="genre" placeholder="Genere" />
      <input v-model="year" type="number" placeholder="Anno" />
      <button class="button-primary" type="submit">Aggiungi libro</button>
    </form>
    <span class="status-message" v-if="warningMessage">{{ warningMessage }}</span>
  </div>

  <div class="catalogue-heading"><h2>Libri in catalogo</h2><span class="muted">{{ bookList.length }} risultati</span></div>
  <ul class="list-reset book-list">
    <li v-for="book in bookList" :key="book.self">
      <div><strong><a :href="HOST+book.self" target="_blank">{{ book.title }}</a></strong><p class="muted">{{ book.author || 'Autore non indicato' }}<span v-if="book.year"> · {{ book.year }}</span><span v-if="book.genre"> · {{ book.genre }}</span><span v-if="book.isbn"> · ISBN {{ book.isbn }}</span></p></div>
      <div class="book-actions">
        <button class="button-quiet" @click="takeBook(book)">Prendi in prestito</button>
        <button class="button-danger" v-if="loggedUser.role === 'operator'" @click="deleteBookButton(book)">Elimina</button>
      </div>
    </li>
  </ul>
  </div>
</template>

<style scoped>
.books-panel { overflow: hidden; }
.book-create { display: grid; grid-template-columns: minmax(180px, .7fr) 1.5fr; gap: 18px; margin-top: 17px; padding: 22px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }
.book-create h2, .catalogue-heading h2 { margin: 0; color: var(--color-heading); font-size: 18px; letter-spacing: -.03em; }
.book-create p { margin: 3px 0 0; }
.book-create form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; }
.book-create form button { grid-column: span 2; }
.catalogue-heading { display: flex; align-items: baseline; justify-content: space-between; margin: 30px 0 10px; }
.book-list { border-top: 1px solid var(--color-border); }
.book-list li { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 17px 4px; border-bottom: 1px solid var(--color-border); }
.book-list strong { color: var(--color-heading); font-size: 14px; }
.book-list p { margin: 4px 0 0; }
.book-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px; }
@media (max-width: 680px) { .book-create { grid-template-columns: 1fr; } .book-create form { grid-template-columns: 1fr; } .book-create form button { grid-column: auto; } .book-list li { align-items: flex-start; flex-direction: column; } .book-actions { justify-content: flex-start; } }
</style>
