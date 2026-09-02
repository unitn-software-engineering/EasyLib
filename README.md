# 📚 EasyLib - Fullstack Library Management System

> **Progetto & Template Didattico per il corso di Ingegneria del Software**  
> *Dipartimento di Ingegneria e Scienza dell'Informazione (DISI) — Università degli Studi di Trento*

[![Node.js CI](https://github.com/unitn-software-engineering/EasyLib/actions/workflows/node.js.yml/badge.svg)](https://github.com/unitn-software-engineering/EasyLib/actions/workflows/node.js.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node: >=22.0.0](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green.svg)](https://nodejs.org/)
[![OpenAPI: 3.0](https://img.shields.io/badge/OpenAPI-3.0-brightgreen.svg)](http://localhost:8080/api-docs)

---

## 📑 Indice dei Contenuti

1. [📖 Panoramica del Progetto](#1--panoramica-del-progetto)
2. [🧠 Metodologia di Sviluppo (AI-Assisted Agile)](#2--metodologia-di-sviluppo-ai-assisted-agile)
3. [📐 Architettura e Modelli UML](#3--architettura-e-modelli-uml)
4. [📋 Product Backlog & User Stories](#4--product-backlog--user-stories)
5. [🔄 Diario delle Iterazioni & Changelog (Sprint Logs)](#5--diario-delle-iterazioni--changelog-sprint-logs)
6. [🌿 Git Workflow & Convenzioni di Progetto](#6--git-workflow--convenzioni-di-progetto)
7. [🚀 Guida all'Installazione, Configurazione ed Esecuzione](#7--guida-allinstallazione-configurazione-ed-esecuzione)
8. [📚 Riferimenti & Risorse Utili](#8--riferimenti--risorse-utili)

---

## 1. 📖 Panoramica del Progetto

**EasyLib** è una piattaforma *fullstack* per la gestione integrata dei prestiti bibliotecari universitari. Il sistema consente agli studenti di consultare il catalogo dei libri, verificare la disponibilità delle copie in tempo reale e gestire i propri prestiti attivi, autenticandosi tramite credenziali locali o Google OAuth.

### 🏛️ Architettura di Sistema

Il progetto adotta un'architettura **Fullstack Monorepo**, suddivisa in:

- **Backend (`/app`)**: API RESTful stateless basata su **Node.js (ES Modules)** e **Express 5**, con persistenza su **MongoDB** tramite **Mongoose ODM**.
  - Autenticazione basata su **JSON Web Token (JWT)** e verifica Google OAuth (`google-auth-library`).
  - Documentazione automatica ed interattiva con **Swagger UI / OpenAPI 3.0** (`oas3.yaml`).
  - Pattern HATEOAS: le relazioni tra risorse sono espresse tramite URI (`self`).
- **Frontend (`/frontend`)**: Single Page Application (SPA) reattiva realizzata con **Vue 3** (Composition/Options API), **Vite**, e **Vue Router**.
  - Servita in modalità sviluppo con HMR o compilata in `/frontend/dist` e servita staticamente dal backend Express sull'endpoint `/EasyLibApp/`.
- **Testing & CI/CD**:
  - Test di unità e di integrazione con **Jest** e **Supertest**.
  - Pipeline di Continuous Integration con **GitHub Actions** (`.github/workflows/node.js.yml`).

---

## 2. 🧠 Metodologia di Sviluppo (AI-Assisted Agile)

Il progetto segue un processo di sviluppo **Agile iterativo e incrementale** (ispirato a Scrum), arricchito dall'adozione sistematica di strumenti di **AI-Assisted Software Engineering** (es. *Antigravity IDE*, GitHub Copilot o agenti LLM).

```mermaid
flowchart LR
    A[📋 Sprint Planning & User Stories] --> B[🤖 AI Prompting & Plan Mode]
    B --> C[🔍 Human Review del Piano]
    C --> D[💻 Sviluppo & Modelli UML]
    D --> E[🧪 Test Automatici Jest/Supertest]
    E --> F[👥 Review PR & Retrospettiva]
    F -->|Next Sprint| A
```

### 🎯 Linee Guida per lo Sviluppo con AI

1. **Ruolo dello Sviluppatore (Human-in-the-Loop)**:
   - L'assistente AI agisce da *pair programmer* o *subagente esecutivo*, ma lo **studente è l'architetto e il revisore finale** responsabile della correttezza, sicurezza, robustezza ed eleganza del codice.
   - Non accettare passivamente suggerimenti di codice senza averne compreso la logica e verificato i requisiti non funzionali.
2. **Ciclo Operativo per ogni Task**:
   - **1. Context & Prompting**: Fornire all'AI contesto chiaro (modelli dati attuali, file coinvolti, vincoli di dominio).
   - **2. Planning**: Richiedere un piano di implementazione prima della stesura del codice, valutando impatti su API, modelli e test.
   - **3. Test-First / Test-Driven**: Scrivere o aggiornare i test automatici prima o contestualmente al codice.
   - **4. Verification & Validation**: Eseguire la suite di test (`npm test`) e verificare manualmente le funzionalità da interfaccia.
3. **Mitigazione dei Rischi AI**:
   - *Allucinazioni su API/librerie*: Verificare sempre la compatibilità con le versioni in uso (es. Express 5, Mongoose 8, Node 22 ESM).
   - *Regressioni*: Mantenere una copertura di test elevata per rilevare tempestivamente effetti collaterali indesiderati.
4. **Trasparenza**:
   - Documentare nel registro di ogni iterazione (Sprint Log) i prompt principali, le sfide affrontate e gli interventi correttivi umani.

---

## 3. 📐 Architettura e Modelli UML

### 3.1 Modello di Dominio (Domain Model)

Il modello concettuale rappresenta le entità chiave del sistema bibliotecario e le loro relazioni:

```mermaid
classDiagram
    direction LR

    class Student {
        +ObjectId _id
        +String email
        +String password
    }

    class Book {
        +ObjectId _id
        +String title
        +String author
        +String isbn
        +String genre
        +Number year
    }

    class Booklending {
        +ObjectId _id
        +ObjectId student
        +ObjectId book
        +Date start_date
        +Date end_date
        +String status
    }

    Student "1" --> "0..*" Booklending : effettua
    Book "1" --> "0..1" Booklending : è associato a
```

---

### 3.2 Diagramma delle Classi & Schemi Dati (Mongoose)

```mermaid
classDiagram
    class StudentModel {
        +String email [unique, required]
        +String password [required]
    }

    class BookModel {
        +String title [required]
        +String author
        +String isbn
        +String genre
        +Number year
    }

    class BooklendingModel {
        +ObjectId student [ref: Student, required]
        +ObjectId book [ref: Book, required]
        +Date createdAt
    }

    BooklendingModel ..> StudentModel : ObjectId Ref
    BooklendingModel ..> BookModel : ObjectId Ref
```

---

### 3.3 Diagrammi di Sequenza

#### 🔐 A. Flusso di Autenticazione (JWT)

```mermaid
sequenceDiagram
    autonumber
    actor Utente as 👤 Studente
    participant Client as 🖥️ Vue Frontend
    participant Server as ⚙️ Express Backend (/authentications)
    participant DB as 🗄️ MongoDB (Student)

    Utente->>Client: Inserisce email e password
    Client->>Server: POST /api/v1/authentications { email, password }
    Server->>DB: Student.findOne({ email })
    DB-->>Server: Dati studente
    alt Credenziali Valide
        Server->>Server: Genera JWT (HMAC-SHA256, exp: 24h)
        Server-->>Client: 200 OK { token, email, id, self }
        Client->>Client: Salva token nello state reattivo / localStorage
    else Credenziali Errate / Utente Inesistente
        Server-->>Client: 401 Unauthorized { success: false, message }
    end
```

#### 📖 B. Flusso di Prestito Libro (`POST /api/v1/booklendings`)

```mermaid
sequenceDiagram
    autonumber
    actor Utente as 👤 Studente Autenticato
    participant Client as 🖥️ Vue Frontend
    participant TokenChecker as 🛡️ Token Middleware
    participant Controller as ⚙️ Booklendings Router
    participant DB as 🗄️ MongoDB

    Utente->>Client: Seleziona libro e clicca "Prendi in prestito"
    Client->>TokenChecker: POST /api/v1/booklendings (con x-access-token)
    TokenChecker->>TokenChecker: Verifica validità JWT
    TokenChecker->>Controller: req.loggedUser popolato
    Controller->>DB: Student.findById(studentId)
    Controller->>DB: Book.findById(bookId)
    Controller->>DB: Booklending.find({ book: bookId })
    alt Libro già in prestito
        Controller-->>Client: 409 Conflict { error: 'Book already out' }
    else Libro disponibile e dati validi
        Controller->>DB: Booklending.save({ student, book })
        DB-->>Controller: Nuovo documento salvato
        Controller-->>Client: 201 Created (Location: /api/v1/booklendings/:id)
    end
```

---

### 3.4 Mappa delle Risorse & Endpoints REST API

| Metodo | Endpoint | Auth Richiesta? | Descrizione |
|---|---|:---:|---|
| `POST` | `/api/v1/authentications` | ❌ No | Autentica utente locale o token Google; restituisce JWT |
| `GET` | `/api/v1/students` | ❌ No | Restituisce la lista degli studenti |
| `POST` | `/api/v1/students` | ❌ No | Registra un nuovo studente nel sistema |
| `GET` | `/api/v1/students/me` | ✅ Sì (`tokenChecker`) | Restituisce il profilo dello studente autenticato |
| `GET` | `/api/v1/books` | ❌ No | Restituisce i libri (supporta filtri `?title=...&author=...`) |
| `GET` | `/api/v1/books/:id` | ❌ No | Dettagli di un singolo libro |
| `POST` | `/api/v1/books` | ❌ No | Inserimento di un nuovo libro nel catalogo |
| `DELETE` | `/api/v1/books/:id` | ❌ No | Rimozione di un libro dal catalogo |
| `GET` | `/api/v1/booklendings` | ✅ Sì (`tokenChecker`) | Lista prestiti (filtrabile con `?studentId=...`) |
| `POST` | `/api/v1/booklendings` | ✅ Sì (`tokenChecker`) | Creazione di un nuovo prestito |
| `DELETE` | `/api/v1/booklendings/:id` | ❌ No | Restituzione / cancellazione prestito |

---

## 4. 📋 Product Backlog & User Stories

Le funzionalità del sistema sono descritte sotto forma di **User Stories**, arricchite con criteri di accettazione formulati in linguaggio *Given-When-Then* (Gherkin format).

### 🏷️ Modello di User Story

```text
Come [Ruolo Utente: Studente / Bibliotecario / Amministratore],
Voglio [Azione / Funzionalità desiderata],
Per [Valore di business / Beneficio atteso].
```

---

### 📌 Backlog Iniziale

| ID | User Story | Priorità | Stato |
|---|---|:---:|:---:|
| **US-01** | *Come studente*, voglio consultare il catalogo dei libri con autore, titolo e ISBN, *per trovare testi di mio interesse per i corsi*. | **Must Have** | ✅ Completata (Sprint 1) |
| **US-02** | *Come studente*, voglio filtrare i libri per titolo o autore, *per individuare rapidamente il volume desiderato*. | **Should Have** | ✅ Completata (Sprint 1) |
| **US-03** | *Come studente registrato*, voglio effettuare il login con credenziali o account Google, *per accedere all'area riservata prestiti*. | **Must Have** | ✅ Completata (Sprint 0) |
| **US-04** | *Come studente autenticato*, voglio prendere in prestito un libro disponibile, *per poterlo ritirare e consultare*. | **Must Have** | ✅ Completata (Sprint 0) |
| **US-05** | *Come studente autenticato*, voglio visualizzare i miei prestiti attivi, *per monitorare i libri in mio possesso*. | **Must Have** | ✅ Completata (Sprint 0) |
| **US-06** | *Come studente*, non devo poter prendere in prestito un libro già occupato da un altro utente, *per evitare conflitti fisici di copie*. | **Must Have** | ✅ Completata (Sprint 0) |
| **US-07** | *Come bibliotecario*, voglio registrare la restituzione di un libro, *per renderlo nuovamente disponibile nel catalogo*. | **Should Have** | ⏳ In Backlog |
| **US-08** | *Come studente*, voglio visualizzare la data di scadenza del prestito e lo stato di overdue, *per evitare ritardi nella restituzione*. | **Could Have** | ⏳ In Backlog |

---

### ✅ Definition of Done (DoD)

Per considerare una User Story o un Task come **completato (Done)**, devono essere soddisfatte le seguenti condizioni:

- [ ] **Modellazione**: I modelli di dominio e i diagrammi UML (Mermaid) nel `README.md` sono aggiornati.
- [ ] **Codice**: Il codice rispetta le convenzioni di stile, è privo di lint errors ed è commentato dove necessario.
- [ ] **Test**: I test di unità e di integrazione (Jest + Supertest) sono scritti, passano con successo (`npm test`) e mantengono un coverage adeguato.
- [ ] **Specifica OpenAPI**: Il file `oas3.yaml` è allineato con le nuove route/parametri/schemi e visualizzabile su `/api-docs`.
- [ ] **Frontend**: L'interfaccia Vue 3 è aggiornata, reattiva e verificata end-to-end con il backend.
- [ ] **Version Control**: I commit seguono la convenzione *Conventional Commits* e sono stati integrati tramite branch dedicato.
- [ ] **Documentazione**: Il changelog di sprint nel `README.md` è stato compilato con obiettivi, test e riflessioni AI.

---

## 5. 🔄 Diario delle Iterazioni & Changelog (Sprint Logs)

> *Questa sezione documenta la progressione incrementale del progetto ad ogni iterazione Agile (Sprint).*

---

### 🔹 Sprint 0: Inizializzazione, Setup Fullstack & Baseline

- **Obiettivo dello Sprint**: Unificazione dell'architettura in un monorepo fullstack (Backend Express + Frontend Vue 3), setup della suite di test Jest con ES Modules, configurazione CI con GitHub Actions.
- **User Stories Affrontate**: US-03 (Autenticazione JWT/Google), US-04 (Prestito base), US-05 (Visualizzazione prestiti).
- **Modifiche al Codice & API**:
  - Creazione struttura backend `/app` con routing modulare (`authentications`, `students`, `books`, `booklendings`).
  - Importazione SPA Vue 3 nella directory `/frontend/` con supporto Vite.
  - Configurazione script di build unificati in `package.json` (`build`, `dev:frontend`, `install:all`).
  - Configurazione pipeline GitHub Actions per test automatici e build.
- **Test & Copertura**:
  - Test suite Jest per autenticazione, tokenChecker, books e booklendings (12 test superati).
- **Riflessione AI & Tooling**:
  - Utilizzo di Antigravity per l'unificazione del repository e l'automazione della configurazione dei percorsi statici.

---

### 🔹 Sprint 1: Estensione Modello Libro & Ricerca Avanzata

- **Obiettivo dello Sprint**: Arricchire l'entità `Book` con metadati realistici (autore, ISBN, genere, anno di pubblicazione), consentire il filtraggio dei libri per titolo e autore tramite query parameter (`GET /api/v1/books?title=...&author=...`), e aggiornare l'interfaccia utente.
- **User Stories Completate**: **US-01** (Dettagli libro completi), **US-02** (Ricerca e filtro nel catalogo).
- **Modifiche al Codice**:
  - `app/models/book.js`: Estensione dello schema Mongoose con campi `author`, `isbn`, `genre`, `year`.
  - `app/books.js`: Aggiunta logica di filtraggio regex case-insensitive per `title` e `author`; validazione dati in `POST /api/v1/books`.
  - `app/books.test.js`: Suite completa di test per filtri multipli, validazioni campi obbligatori e recupero singolo libro.
  - `oas3.yaml`: Aggiornamento schema `Book` e parametri query dell'endpoint `GET /api/v1/books`.
  - `frontend/src/components/BooksTable.vue`: Visualizzazione colonne estese (Autore, ISBN, Genere, Anno) e barra di ricerca interattiva.
- **Aggiornamento Modelli UML**:
  - Aggiornato il *Domain Model* e il *Class Diagram* per riflettere i nuovi attributi dell'entità `Book`.
- **Test & Qualità**:
  - 100% test passati su `books.test.js`.
- **AI Tooling Log (Prompt & Human Review)**:
  - *Prompt*: *"Estendi il modello Book e l'endpoint GET per supportare query filtering con RegExp case-insensitive, mantenendo compatibilità retroattiva con i record esistenti."*
  - *Human Revision*: Verificato che la ricerca parziale con RegExp non esponga vulnerabilità di ReDoS e che i campi opzionali non rompano i vecchi test.
- **Retrospettiva Sprint**:
  - *Cosa ha funzionato*: La suddivisione delle responsabilità tra backend e frontend ha permesso un'integrazione fluida. L'uso di Jest con mock ha garantito test rapidi e isolati.
  - *Miglioramenti futuri*: Introdurre paginazione per cataloghi di grandi dimensioni (`?page=1&limit=10`).

---

### 🔹 Sprint 2: [Spazio per le prossime iterazioni del Team]

*(Compilare ad ogni sprint seguendo il template sottostante)*

- **Obiettivo dello Sprint**: [Descrizione chiara dell'obiettivo]
- **User Stories Affrontate**: [Elenco ID e titoli delle US]
- **Modifiche al Codice & API**: [Nuovi endpoint, refactoring, componenti frontend]
- **Aggiornamento Modelli UML**: [Diagrammi modificati o nuovi sequence diagram]
- **Test & Qualità**: [Nuovi test aggiunti, metriche di copertura]
- **AI Tooling Log**: [Prompt significativi, correzioni apportate al codice generato dall'AI]
- **Retrospettiva Sprint**: [Punti di forza, criticità e azioni di miglioramento]

---

## 6. 🌿 Git Workflow & Convenzioni di Progetto

Per mantenere la cronologia Git pulita, leggibile e tracciabile, il team adotta **GitHub Flow** integrato con la convenzione **Conventional Commits**.

### 6.1 Branching Strategy (GitHub Flow)

```mermaid
gitGraph
    commit id: "Initial setup"
    commit id: "Sprint 0 Baseline"
    branch feature/book-details-and-filter
    checkout feature/book-details-and-filter
    commit id: "feat(models): add book attributes"
    commit id: "feat(books): add search filtering"
    commit id: "test(books): add unit tests"
    checkout master
    merge feature/book-details-and-filter id: "Merge PR #1: Book search"
    commit id: "docs: update Sprint 1 log"
```

- **`master`**: Ramo principale protetto. Contiene solo codice stabile, testato e pronto per il deployment.
- **`feature/<nome-feature>`**: Ramo dedicato allo sviluppo di una specifica User Story o funzionalità (es. `feature/book-search`, `feature/overdue-reminders`).
- **`fix/<nome-bug>`**: Ramo per la risoluzione di difetti e bug (es. `fix/jwt-expiration-check`).
- **`docs/<argomento>`**: Ramo dedicato a documentazione, modelli UML o guide (es. `docs/update-architecture-diagrams`).

---

### 6.2 Convenzione dei Messaggi di Commit (Conventional Commits)

I messaggi di commit devono rispettare la struttura standard:

```text
<tipo>(<ambito facoltativo>): <descrizione sintetica all'imperativo o presente>

[corpo facoltativo con motivazione e dettagli tecnici]

[riferimenti a issue/PR, es. Closes #12]
```

#### Tipi Ammessi:

- **`feat`**: Nuova funzionalità per l'utente finale o per le API (es. `feat(books): add query filtering by title and author`).
- **`fix`**: Correzione di un bug (es. `fix(auth): fix token verification on expired sessions`).
- **`test`**: Aggiunta o modifica di test automatici (es. `test(books): add integration tests for search endpoints`).
- **`docs`**: Modifiche alla documentazione o ai modelli UML (es. `docs(readme): add sequence diagram for book lending`).
- **`refactor`**: Modifiche al codice che non correggono bug né aggiungono feature (es. `refactor(students): simplify email validation regex`).
- **`chore`**: Aggiornamenti a dipendenze, build script o configurazioni (es. `chore(deps): update mongoose to v8.19.4`).
- **`ci`**: Modifiche ai workflow di Continuous Integration (es. `ci(actions): add frontend build step`).

---

### 6.3 Processo di Pull Request & Code Review

Prima di effettuare il merge su `master`:
1. Assicurarsi che tutti i test passino localmente (`npm test`).
2. Aprire una Pull Request verso `master` con descrizione delle modifiche e riferimento alle User Stories collegate.
3. Ottenere l'approvazione di almeno un membro del team (o validazione formale con checklist AI).
4. Eseguire il merge preferibilmente con *Squash and merge* o *Rebase* per mantenere la storia lineare.

---

## 7. 🚀 Guida all'Installazione, Configurazione ed Esecuzione

### 7.1 Prerequisiti

- **Node.js**: Versione `>= 22.0.0`
- **npm**: Versione `>= 10.0.0`
- **MongoDB**: Istanza locale in esecuzione su porta standard `27017` oppure URI di connessione MongoDB Atlas.

---

### 7.2 Configurazione delle Variabili d'Ambiente (`.env`)

Crea il file `.env` nella root del progetto partendo dall'esempio fornito:

```bash
cp .env.example .env
```

Configura i seguenti parametri nel file `.env`:

```ini
# Porta del server HTTP Express
PORT=8080

# Chiave segreta per la firma dei JSON Web Tokens (JWT)
SUPER_SECRET=your_super_secret_jwt_key_here

# URI di connessione al database MongoDB
DB_URL=mongodb://localhost:27017/easylib

# ID Client Google OAuth 2.0 (opzionale per login Google)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Per il frontend, è possibile configurare facoltativamente il file `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

---

### 7.3 Comandi di Installazione ed Esecuzione

Dalla root del repository:

#### 1. Installazione di tutte le dipendenze (Backend + Frontend):
```bash
npm run install:all
```

#### 2. Compilazione del Frontend Vue:
```bash
npm run build
```
*(I file statici compilati vengono posizionati in `/frontend/dist` e serviti automaticamente da Express su `/EasyLibApp/`)*

#### 3. Avvio del Server Backend (Modalità Sviluppo con caricamento `.env`):
```bash
npm run dev
```
Il server sarà attivo all'indirizzo: **`http://localhost:8080`**

#### 4. Avvio del Frontend Vue in modalità Hot-Reload (Opzionale durante sviluppo UI):
```bash
npm run dev:frontend
```
Il dev server Vite sarà attivo all'indirizzo: **`http://localhost:5173`**

---

### 7.4 Esecuzione della Test Suite

I test sono implementati con **Jest** e **Supertest** per verificare il corretto comportamento delle API REST:

```bash
# Esecuzione di tutti i test
npm test

# Esecuzione dei test in sequenza (utile per evitare race condition su DB condiviso)
npm run testInSequence
```

---

### 7.5 Documentazione Interattiva API (Swagger UI)

Una volta avviato il server con `npm run dev`, la documentazione OpenAPI 3.0 interattiva è accessibile nel browser all'indirizzo:

👉 **`http://localhost:8080/api-docs`**

Da questa interfaccia è possibile esplorare tutti gli endpoint, verificare i contratti di richiesta/risposta e testare direttamente le chiamate HTTP.

---

## 8. 📚 Riferimenti & Risorse Utili

- [Express.js v5 Documentation](https://expressjs.com/)
- [Mongoose ODM Guide](https://mongoosejs.com/docs/)
- [Vue.js 3 Official Guide](https://vuejs.org/guide/introduction.html)
- [Vite Documentation](https://vitejs.dev/)
- [OpenAPI Specification 3.0](https://swagger.io/specification/)
- [Conventional Commits v1.0.0](https://www.conventionalcommits.org/it/v1.0.0/)
- [Mermaid.js Diagramming Syntax](https://mermaid.js.org/)
- [Google Cloud OAuth 2.0 Guide](https://developers.google.com/identity/gsi/web/guides/overview)

---

*EasyLib — Repository didattico a cura del gruppo docenti del corso di Ingegneria del Software, Università di Trento.*
