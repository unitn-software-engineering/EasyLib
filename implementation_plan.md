# EasyLib Implementation Plan

## Stato del piano

- Stato: PROPOSTA — in attesa di approvazione umana
- Data: 2026-09-15
- Baseline di processo: D1-2026 v2.2, Feature Discovery Pack v1.2, D2 v1.1, D3 v1.1, Task & Agentic Implementation Plan v1.1
- Repository analizzato: branch `main`, commit corrente `b33f735`
- Vincolo: nessun codice applicativo verrà modificato prima dell'approvazione di questo piano e delle specifiche operative della feature interessata.
- Decisioni umane ricevute: prenotazioni deferred; proroga operatore +30 giorni; storico prestiti persistente; ruoli user/operator; CRUD catalogo riservato all'operatore; login locale/Google, notifiche e RNF D1 confermati.
- Decisioni tecniche ricevute: dataset biblioteche locale; notifiche locali persistenti senza email; CLI/seed per il primo operatore; `mongodb-memory-server` come database temporaneo isolato per i test.

## 1. Risultato dell'audit

### Stato attuale

- Backend Node.js ES Modules con Express 5, Mongoose 8, JWT e Google authentication.
- Modelli presenti: `Student`, `Book`, `Booklending`.
- API presenti: autenticazione, studenti, libri e prestiti; OpenAPI in `oas3.yaml`.
- Frontend Vue 3/Vite con viste essenziali per libri e prestiti e login locale/Google.
- Test Jest/Supertest presenti per applicazione, studenti, libri e prestiti.
- Una sola specifica di feature formalizzata nel repository: `specs/US-07-return-book.md`.
- Non risultano presenti gli artefatti di Feature Discovery, D2, D3, task backlog, verification record o configurazione OpenCode richiesta dalle nuove linee guida.
- È presente solo `.opencode/config.example.json`: è un esempio di configurazione Vertex AI con `rulesFiles`, ma non contiene gli agenti, i comandi custom o i permessi conservativi richiesti dal workflow IS 2026. Non risulta presente un `opencode.json` attivo versionato nella root.

### Gap tecnici e di prodotto da gestire

- Le password vengono memorizzate e confrontate in chiaro; questo viola il vincolo di sicurezza della nuova baseline.
- Il JWT non contiene un ruolo e le rotte non distinguono operatore biblioteca e utente biblioteca.
- La protezione globale di `/booklendings` verifica il token, ma la logica usa ancora identificativi forniti dal client e non dimostra ownership/authorization per ogni operazione.
- `GET /booklendings` permette di filtrare tramite `studentId`; deve essere definito se un operatore può vedere altri utenti e come viene autorizzata tale operazione.
- La restituzione è implementata come cancellazione del prestito; il modello e la specifica D1 richiedono anche storico e data di restituzione, quindi la semantica deve essere confermata prima di estendere il comportamento.
- La route DELETE dei prestiti non valida esplicitamente un ObjectId malformato, mentre `specs/US-07-return-book.md` richiede HTTP 400.
- Le rotte di libri e studenti sono in gran parte non protette e non applicano ruoli operativi.
- Registrazione, proroga, ricerca biblioteche, storico prestiti, notifiche, cambio lingua e gestione completa del catalogo non sono implementati come feature coerenti con D1.
- Il frontend espone operazioni amministrative (creazione/cancellazione libri) senza un controllo di ruolo e usa valori di autenticazione precompilati nel componente di login.
- Il frontend non verifica sistematicamente gli errori HTTP, usa in alcuni casi il token nella query string e non dispone di una suite di test UI/e2e.
- La suite backend non è riproducibile nell'ambiente corrente: `npm test -- --runInBand` fallisce per il rifiuto della connessione DNS a MongoDB Atlas e, in un test Supertest, per `listen EPERM`. Questo va risolto come attività di infrastruttura/test prima di poter dichiarare una feature verificata.

## 2. Gate di specifica prima dell'implementazione

Prima di scrivere codice il team deve approvare o aggiornare:

1. `D1`/Feature Baseline con RF, RNF, UC, US, AC, mockup, User Flow e traceability complete.
2. La decisione su `GAP-EASY-01`: prenotazioni IN, OUT o deferred.
3. La decisione su `CLAR-EASY-01`: comportamento della proroga e conflitto tra RF6/RF9/UC-RF9.
4. Le regole di ruolo: operatore biblioteca, utente biblioteca e relative autorizzazioni.
5. La semantica del prestito restituito: record storico persistente oppure cancellazione, coerente con D1/D2.
6. I criteri misurabili per RNF1–RNF6 e la loro evidenza prevista.

Finché una decisione modifica comportamento, scope o policy di dominio, deve essere registrata nel relativo artefatto D1/D2 e nel registro GAP/CLAR; non può essere introdotta direttamente nel codice.

## 3. Artefatti di processo da creare

Questi file non implementano comportamento applicativo; rendono il lavoro tracciabile secondo IS 2026.

- `requirements/` o `D1/`: baseline corrente e traceability, se il team decide di duplicare/estrarre il contenuto dei documenti Word.
- `feature-discovery/candidate-features.md`: candidate, evidenze D1, outcome e status.
- `feature-discovery/discovery-decisions.md`: KEEP/MERGE/SPLIT e motivazioni.
- `feature-discovery/coverage-matrix.md`: copertura RF/RNF/UC/US/AC/mockup/User Flow.
- `feature-discovery/feature-inventory.md`: Feature Baseline approvata con priority, scope e status.
- `gap-clar-register.md`: GAP, CLAR, decisioni, owner e stato.
- `specs/FEAT-*.spec.md`: una D2 per ogni feature approvata.
- `specs/FEAT-*/technical-plan.md`: D3, responsabilità, componenti, ADR, API, dati e test strategy.
- `specs/FEAT-*/tasks.md`: task READY, dipendenze, DoR/DoD, agent role ed evidence.
- `specs/FEAT-*/verification.md`: verifica D2/D3/RNF e Feature Verification Gate.
- `.github/pull_request_template.md`: traceability, test, evidence, deviazioni e human gate.
- `.opencode/agents/`: cinque ruoli separati (`analyst`, `specifier`, `planner`, `builder`, `verifier`) con obiettivo, input autorevoli, limiti, stop condition ed evidence attesa.
- `.opencode/commands/`: comandi Markdown per standardizzare discovery, specification, planning, task execution e verification; ogni comando deve ricevere contesto tramite `$ARGUMENTS` senza caricare indiscriminatamente il repository.
- `opencode.json`: configurazione di progetto con provider/modelli senza secret, `rulesFiles: ["AGENTS.md"]` e permessi espliciti `allow`/`ask`/`deny` secondo il formato OpenCode adottato dal team. Il file deve partire dall'esempio esistente senza committare credenziali o project ID sensibili secondo la policy del team.
- `.opencode/config.example.json`: da mantenere come template non operativo, aggiornandolo solo se la configurazione finale cambia schema.

## 4. Ordine di implementazione proposto

### Fase A — Stabilizzazione e test harness

Obiettivo: ottenere una base eseguibile e verificabile prima di aggiungere funzionalità.

File candidati:

- `app/*.test.js`
- `jest.config.js`
- `package.json`
- `app/app.js`
- eventuali nuovi helper di test in `app/` o `test/`

Attività:

- rendere i test indipendenti da MongoDB Atlas usando un database di test controllato dal progetto o un meccanismo già approvato dal team;
- correggere setup/teardown e uso di Supertest senza aprire listener reali;
- aggiungere test di regressione per status code, error handling e middleware;
- non aggiungere dipendenze esterne senza approvazione.

Gate: `npm test` riproducibile e verde sulla baseline esistente.

Stato: PARZIALMENTE AVVIATA. La suite è stata eseguita, ma resta bloccata dall'accesso a MongoDB Atlas e dal listener Supertest nell'ambiente corrente.

### Fase A.1 — OpenCode e controllo agentico

Obiettivo: rendere versionabile e verificabile il modo in cui gli agenti operano sul repository, prima di delegare task applicativi.

File candidati:

- `.opencode/config.example.json`
- `.opencode/agents/*.md`
- `.opencode/commands/*.md`
- `opencode.json`
- `AGENTS.md`
- `.github/pull_request_template.md`

Attività:

- definire i cinque ruoli IS 2026 e impedire sovrapposizioni di responsabilità;
- configurare permessi `deny` per azioni fuori scope e `ask` per human gate, modifiche di specifiche, dipendenze, migrazioni e operazioni Git sensibili;
- aggiungere comandi riusabili che producano artefatti tracciabili e si fermino su GAP/CLAR/design issue;
- documentare il formato di evidence di ogni sessione: task, file modificati, test, deviazioni, blocker e stato;
- verificare che provider, project ID, token e credenziali non siano hardcoded;
- provare la configurazione con un task non distruttivo di analisi, senza autorizzare implementazioni prima dell'approvazione del piano.

Gate: review umana di agenti, comandi, permessi e comportamento di stop; nessun task `@builder` assegnato finché il gate non è PASS.

Stato: COMPLETATA come configurazione repository; richiede ancora la tua revisione manuale.

### Fase B — Sicurezza, identità e autorizzazione

Feature candidate: `FEAT-01 Authentication`, `FEAT-02 User Registration`.

File candidati:

- `app/authentication.js`
- `app/students.js`
- `app/models/student.js`
- `app/tokenChecker.js`
- `app/app.js`
- `oas3.yaml`
- `app/students.test.js`, eventuali nuovi test autenticazione
- componenti Vue di login e stato utente

Attività vincolate a D1/D2:

- hashing delle password e verifica sicura;
- registrazione con validazione, unicità del codice fiscale e gestione dei conflitti;
- ruoli e claim JWT solo se approvati nella specifica;
- protezione e autorizzazione per rotta, verificando `req.loggedUser`;
- rimozione di credenziali precompilate e gestione coerente di login/logout/errori;
- aggiornamento OpenAPI e test-first.

Gate: test di autenticazione, registrazione, accesso negato e autorizzazione per ruolo; security review umana.

### Fase C — Catalogo e ricerca libri

Feature: `FEAT-03 Book Search`.

File candidati:

- `app/books.js`, `app/models/book.js`
- `oas3.yaml`
- `app/books.test.js`
- `frontend/src/states/books.js`
- `frontend/src/components/BooksTable.vue`
- nuova D2/D3 e test UI se approvati

Attività:

- formalizzare in D2 criteri singoli/combinati, semantica dei filtri, input vuoti, nessun risultato e informazioni mostrate;
- allineare query/API/DTO/OpenAPI;
- definire ruoli autorizzati per creazione, modifica e rimozione dei libri;
- mantenere la distinzione tra catalogo bibliografico e disponibilità delle copie;
- verificare i criteri di performance e compatibilità applicabili.

Gate: acceptance scenarios D2, contract/integration tests, build frontend e prova UI.

### Fase D — Ciclo di vita dei prestiti

Feature candidate: `FEAT-04 Loan Creation`, `FEAT-05 Loan Return`, `FEAT-06 Loan Extension`, `FEAT-07 Loan History` secondo il Feature Inventory approvato.

File candidati:

- `app/booklendings.js`
- `app/models/booklending.js`
- `app/models/book.js`
- `app/students.js`
- `oas3.yaml`
- `app/booklendings.test.js`
- `specs/US-07-return-book.md` e nuove specifiche FEAT, se necessario
- `frontend/src/components/BooklendingsTable.vue`
- `frontend/src/views/BooklendingsView.vue`

Attività:

- risolvere prima la semantica D1/D2 di restituzione e storico;
- applicare validazione ObjectId e codici HTTP definiti;
- impedire prestiti duplicati e verificare ownership/ruolo sulla lettura e modifica;
- implementare proroga solo dopo la risoluzione di `CLAR-EASY-01`;
- mantenere le invarianti: disponibilità coerente, integrità referenziale e accesso protetto;
- aggiungere test-first per happy path, edge case, errori, concorrenza logica e regressioni.

Gate: Feature Verification Gate con acceptance evidence, test di integrazione e prova manuale dalla UI.

### Fase E — Ricerca biblioteche e servizi trasversali

Feature candidate: `FEAT-08 Library Search` e ulteriori feature solo se presenti nella Feature Baseline approvata.

File candidati:

- nuovi modelli/router/service in `app/` secondo D3;
- `oas3.yaml`;
- test backend;
- nuove viste/componenti/stati in `frontend/src/`;
- risorse di localizzazione e componenti di notifica secondo D3.

Attività:

- non implementare prenotazioni, notifiche o integrazioni esterne finché `GAP-EASY-01` e i relativi contratti non sono approvati;
- classificare RNF5 come capacità trasversale e definire catalogo messaggi/localizzazione;
- definire external systems e failure behaviour in D2/D3 prima dell'integrazione.

Gate: solo feature IN e APPROVED, con D2/D3 completi.

### Fase F — Executable Increment, CI e verifica finale

File candidati:

- `.github/workflows/node.js.yml` se presente o da aggiungere dopo approvazione;
- `README.md`;
- `frontend/README.md`;
- `package.json`, script di setup e configurazione ambiente;
- `specs/FEAT-*/verification.md`.

Attività:

- rendere ripetibili installazione, test, build e avvio locale;
- produrre un incremento eseguibile dalla UI;
- aggiungere evidence per performance, accessibilità, compatibilità, affidabilità e sicurezza secondo i criteri approvati;
- usare Sprint Review per classificare feedback come BUG, GAP, CLAR, CHANGE o DESIGN CHANGE.

Gate: build/test PASS, webapp provabile, exploratory test completato, traceability completa e human approval.

## 5. Task backlog iniziale dopo approvazione delle specifiche

I seguenti task sono proposte preliminari; diventeranno assegnabili solo dopo D2/D3 e Definition of Ready.

| ID | Obiettivo | Dipendenze | Evidence |
|---|---|---|---|
| `TASK-FOUNDATION-01` | Rendere riproducibile il test harness backend | — | `npm test` verde |
| `TASK-AUTH-01` | Definire modello di identità/ruoli approvato | D1/D2 Auth | D3 + ADR |
| `TASK-AUTH-02` | Implementare password hashing e verifica | `TASK-AUTH-01` | unit/integration tests |
| `TASK-AUTH-03` | Implementare registrazione e vincoli di unicità | `TASK-AUTH-01` | acceptance/API tests |
| `TASK-SEARCH-01` | Stabilizzare criteria model e validazione ricerca | D2/D3 FEAT-03 | unit tests |
| `TASK-SEARCH-02` | Implementare servizio/adapter catalogo | `TASK-SEARCH-01` | integration/contract tests |
| `TASK-SEARCH-03` | Allineare API OpenAPI e frontend | `TASK-SEARCH-02` | API + UI evidence |
| `TASK-LOAN-01` | Formalizzare modello prestito/storico e invarianti | D2/D3 loan lifecycle | model + ADR |
| `TASK-LOAN-02` | Implementare prestito autorizzato | `TASK-LOAN-01` | acceptance tests |
| `TASK-LOAN-03` | Implementare restituzione secondo semantica approvata | `TASK-LOAN-01` | `US-07` tests |
| `TASK-LOAN-04` | Implementare proroga secondo CLAR risolta | `TASK-LOAN-01` | acceptance/RNF tests |
| `TASK-LOAN-05` | Implementare storico e visualizzazione frontend | `TASK-LOAN-03` | API + UI evidence |
| `TASK-QUALITY-01` | Integrare build, CI e verification record | feature tasks complete | CI + verification |

## 6. Regole operative per gli agenti

- `@analyst`: aggiorna Feature Discovery e segnala GAP/CLAR; non implementa codice.
- `@specifier`: produce D2; non decide design tecnico né scope non approvato.
- `@planner`: produce D3, ADR e task; non modifica D2 per adattarlo al codice esistente.
- `@builder`: lavora solo su task READY, scrive prima/insieme i test richiesti e non amplia il comportamento.
- `@verifier`: confronta codice, test ed evidence con D2/D3/RNF; non corregge silenziosamente la specifica.
- Ogni nuova rotta, parametro o DTO richiede aggiornamento di `oas3.yaml` nello stesso ciclo.
- Ogni deviazione deve essere riportata nella PR e nel verification record.

## 7. Human gates richiesti

1. Approvazione del presente piano.
2. Approvazione di Feature Inventory e risoluzione dei GAP/CLAR bloccanti.
3. Approvazione di ogni D2 prima del D3.
4. Approvazione di ogni D3/ADR prima dei task.
5. Task Ready Gate prima dell'assegnazione a `@builder`.
6. Review di codice, test, OpenAPI, sicurezza e traceability prima del merge.
7. Feature Verification Gate prima di dichiarare una feature VERIFIED.

## 8. Condizione di completamento complessiva

EasyLib sarà considerato aggiornato alle linee guida 2026 solo quando tutte le feature MUST in scope nella Feature Baseline approvata avranno:

- D2 e D3 approvati;
- task implementati con test ed evidence;
- API, frontend e documentazione coerenti;
- test automatici, build e incremento eseguibile verificati;
- RNF pertinenti coperti da evidenza;
- traceability completa da D1 a verification;
- nessun comportamento unsupported o decisione di dominio introdotta implicitamente.
