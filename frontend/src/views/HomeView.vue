<script setup>
</script>

<template>
  <main>
    <div class="page-heading"><div><p class="eyebrow">EasyLib workspace</p><h1>Biblioteca, senza rumore.</h1><p>Gestisci il catalogo e tieni sotto controllo i prestiti in un unico spazio.</p></div></div>
    <section class="surface-panel home-welcome"><div><span class="home-symbol">⌘</span><h2>Benvenuto in EasyLib</h2><p>Inizia dal catalogo per cercare un libro oppure apri Prestiti per vedere la tua situazione.</p></div><RouterLink class="button-primary home-action" to="/books">Esplora il catalogo →</RouterLink></section>
  </main>
</template>
<style scoped>
.home-welcome { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 30px; }
.home-welcome h2 { margin: 14px 0 5px; color: var(--color-heading); font-size: 23px; letter-spacing: -.04em; }
.home-welcome p { max-width: 480px; margin: 0; color: var(--color-muted); font-size: 14px; }
.home-symbol { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 12px; background: var(--color-primary-soft); color: var(--color-primary-dark); font-size: 20px; }
.home-action { display: inline-flex; min-height: 40px; align-items: center; border-radius: var(--radius-sm); padding: 8px 13px; color: #fff; font-size: 12px; font-weight: 750; white-space: nowrap; }
.home-action:hover { text-decoration: none; }
@media (max-width: 620px) { .home-welcome { align-items: flex-start; flex-direction: column; } }
</style>
