<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Login from '@/components/Login.vue'
import LoginGoogle from '@/components/LoginGoogle.vue'
import { loggedUser } from './states/loggedUser.js'

</script>

<template>
  <div class="page-shell">
    <aside class="side-panel">
      <div class="brand-lockup"><span class="brand-mark">⌘</span> EasyLib</div>
      <p class="side-label">Workspace</p>
      <nav class="side-nav" aria-label="Workspace navigation">
        <RouterLink to="/"><span class="nav-icon">⌂</span>Home</RouterLink>
        <RouterLink to="/books"><span class="nav-icon">▦</span>Catalogo</RouterLink>
        <RouterLink to="/booklendings"><span class="nav-icon">↗</span>Prestiti</RouterLink>
        <RouterLink to="/libraries"><span class="nav-icon">⌖</span>Biblioteche</RouterLink>
        <RouterLink to="/notifications"><span class="nav-icon">◌</span>Notifiche</RouterLink>
        <RouterLink v-if="loggedUser.role === 'operator'" to="/users"><span class="nav-icon">◎</span>Utenti</RouterLink>
      </nav>
      <p class="side-label">Stato</p>
      <div class="side-tip"><strong>{{ loggedUser.token ? 'Sessione attiva' : 'Accesso richiesto' }}</strong>{{ loggedUser.token ? 'Spazio biblioteca pronto.' : 'Accedi per gestire i tuoi prestiti.' }}</div>
    </aside>
    <div class="main-column">
      <header class="top-bar"><div class="auth-area"><Login /><span class="google-login"><LoginGoogle /></span></div></header>
      <main class="content-wrap"><RouterView /></main>
    </div>
  </div>
</template>

<style>
@import '@/assets/base.css';

</style>
