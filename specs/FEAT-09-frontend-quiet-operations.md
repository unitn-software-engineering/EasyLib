# FEAT-09 — Frontend Quiet Operations

## Stato

- Design direction: APPROVED — variante 3 “Quiet Operations”
- Implementation status: IMPLEMENTED — human review pending
- Scope: visual redesign of the existing Vue frontend; no domain or API changes

## Intento

Rendere EasyLib più sobrio, leggibile e orientato alle attività quotidiane dell’operatore, mantenendo una UI semplice per l’utente biblioteca.

## Direzione visuale

- palette principale verde salvia, fondi grigio-verde molto chiari e testo antracite;
- gerarchia tipografica compatta, con titoli netti e testo secondario attenuato;
- navigazione laterale persistente su desktop e comportamento compatto su viewport strette;
- superfici contenute, bordi sottili, raggi moderati e ombre leggere;
- stati di prestito espressi con badge testuali accessibili, non solo con il colore;
- azioni primarie riconoscibili e azioni distruttive separate visivamente;
- tono operativo: meno decorazione, più spazio per tabelle, filtri, scadenze e notifiche.

## Vincoli funzionali

- non cambiare endpoint, DTO, autenticazione o autorizzazioni;
- mantenere i flussi esistenti di catalogo, prestiti, biblioteche, notifiche e utenti;
- mantenere la distinzione tra utente e operatore già presente nel frontend;
- non introdurre dipendenze esterne senza approvazione;
- mantenere responsive design e navigazione da tastiera.

## Criteri di accettazione

- AC-01: le viste principali condividono palette, tipografia, spaziatura e componenti coerenti;
- AC-02: l’operatore riconosce rapidamente catalogo, prestiti attivi, prestiti archiviati, utenti e notifiche;
- AC-03: l’utente non autenticato non vede azioni amministrative;
- AC-04: ogni stato di prestito resta comprensibile anche senza distinguere i colori;
- AC-05: i controlli interattivi hanno focus visibile, etichette comprensibili e contrasto adeguato;
- AC-06: la build frontend termina correttamente e i test backend non subiscono regressioni;
- AC-07: il redesign non modifica il comportamento delle chiamate API esistenti.
- AC-08: la shell espone un collegamento riconoscibile al repository GitHub del progetto, apribile in una nuova scheda.

## Evidenze richieste

- screenshot o prova manuale delle viste Home, Books, Booklendings, Libraries, Notifications e Users;
- `npm run build` completato;
- `npm test -- --runInBand` completato;
- verifica manuale con ruolo user, operator e stato non autenticato.
