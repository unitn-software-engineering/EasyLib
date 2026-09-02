// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { reactive, ref } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`
const BOOKS_URL = API_URL+'/books'
const LENDINGS_URL = API_URL+'/booklendings'



const books = reactive([])

async function fetchBooks(query = {}) {
    let url = new URL(BOOKS_URL);
    if (query.title) url.searchParams.append('title', query.title);
    if (query.author) url.searchParams.append('author', query.author);
    const response = await fetch(url);
    books.value = await response.json();
}

async function createBook(bookData) {
    const payload = typeof bookData === 'string' ? { title: bookData } : bookData;
    await fetch(BOOKS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    fetchBooks();
};

async function deleteBook(book) {
    await fetch(HOST+book.self, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    fetchBooks()
};

async function takeBook(book) {
    await fetch(LENDINGS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { student: loggedUser.self, book: book.self } ),
    })
};



export { books, fetchBooks, createBook, deleteBook } 