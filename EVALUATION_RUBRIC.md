# 📊 Rubrica di Valutazione: Spec-Driven Development con Agenti AI

> **Criteri di Valutazione dei Progetti Didattici**  
> *Corso di Ingegneria del Software — DISI, Università degli Studi di Trento*

Questa rubrica definisce i criteri e i punteggi per la valutazione dei progetti d'esame sviluppati con metodologia **Spec-Driven Development (SDD)** assistita da agenti intelligenti.

---

## 🧭 Filosofia di Valutazione

Nel paradigma dello sviluppo con Agenti AI, la valutazione **non premia la mera quantità di codice generato**, ma la **qualità ingegneristica del processo**:
1. **Precisione e Rigore delle Specifiche**: Capacità di vincolare l'agente senza ambiguità.
2. **Qualità ed Efficacia dei Test**: I test come prima barriera di conformità e non-regressione.
3. **Controllo Architetturale & Human-in-the-Loop**: Consapevolezza critica, revisione del codice e prevenzione di allucinazioni/degrado.
4. **Automazione & Continuous Integration**: Pipeline CI robusta e documentazione viva.
5. **Padronanza e Difesa Orale**: Capacità di spiegare e giustificare ogni scelta architetturale.

---

## 📋 Dimensioni di Valutazione

| Dimensione | Peso | Descrizione |
|---|:---:|---|
| **1. Rigore e Completezza delle Specifiche (SDD)** | **25%** | OpenAPI 3.0, diagrammi UML, schemi dati, criteri Gherkin, invarianti di dominio. |
| **2. Test-Driven Alignment & Copertura** | **25%** | Test scritti a partire dalle specifiche prima/con il codice, edge cases, robustezza suite. |
| **3. Governance dell'Agente & Human-in-the-Loop** | **20%** | Gestione prompt/piani, prevenzione allucinazioni, Sprint Logs, pulizia commit e PR. |
| **4. Qualità Architetturale, Sicurezza & CI/CD** | **15%** | Clean Architecture, separazione responsabilità, pipeline GitHub Actions verde, sicurezza JWT. |
| **5. Padronanza Tecnica & Difesa Orale** | **15%** | Comprensione del codice, motivazione delle decisioni, capacità di refactoring live. |

---

## 🔍 Dettaglio dei Criteri e Livelli di Valutazione

```mermaid
quadrantChart
    title Mappa di Valutazione: Controllo Ingegneristico vs Uso Agente
    x-axis Basso Controllo Ingegneristico --> Alto Controllo Ingegneristico
    y-axis Uso Passivo Agente (Vibe Coding) --> Uso Governativo Agente (Spec-Driven)
    quadrant-1 "🏆 Eccellente (Spec-Driven Master)"
    quadrant-2 "⚠️ Rischio: Prompting fine a se stesso"
    quadrant-3 "❌ Insufficiente (Codice opaco)"
    quadrant-4 "🟡 Tradizionale (Manca leva AI)"
```

---

### 1. Rigore e Completezza delle Specifiche (25%)

| Livello | Descrizione | Punteggio |
|---|---|:---:|
| **Eccellente (28 - 30L)** | Specifiche formali complete ([`SPEC_TEMPLATE.md`](file:///Users/marcorobol/Develop/IS/EasyLib/SPEC_TEMPLATE.md)), OpenAPI 3.0 dettagliato con tutti i codici di errore (400, 401, 404, 409), diagrammi UML (classi, sequenza) coerenti, criteri di accettazione Gherkin precisi, invarianti di business esplicite. Nessuna ambiguità lasciata all'agente. | 28 - 30L |
| **Buono / Discreto (24 - 27)** | Specifiche presenti e corrette nella maggior parte delle feature; OpenAPI aggiornato; diagrammi UML presenti ma con qualche lieve omissione di edge case o invarianti non completamente formalizzate. | 24 - 27 |
| **Sufficiente (18 - 23)** | Specifiche minime, contratti API parzialmente documentati, assenza di alcuni codici di errore o criteri Gherkin generici. | 18 - 23 |
| **Insufficiente (< 18)** | Specifiche assenti, obsolete o discordanti rispetto al codice; OpenAPI mancante o non funzionante; l'agente è stato usato senza specifiche preliminari. | < 18 |

---

### 2. Test-Driven Alignment & Copertura (25%)

| Livello | Descrizione | Punteggio |
|---|---|:---:|
| **Eccellente (28 - 30L)** | Test di unità e di integrazione (Jest + Supertest) derivati direttamente dai criteri Gherkin e dalle invarianti di specifica. Test sia per Happy Path che per tutti i casi di errore e boundary condition. Copertura alta e assenza di test fragili o "finti" (senza asserzioni reali). | 28 - 30L |
| **Buono / Discreto (24 - 27)** | Buona copertura dei test sulle rotte principali; gestione corretta dei casi di errore più comuni; lievi lacune su casi limite o mock avanzati. | 24 - 27 |
| **Sufficiente (18 - 23)** | Test presenti ma limitati solo all'Happy Path; assenza di test su permessi/autenticazione o test scritti a posteriori in modo disallineato rispetto alle specifiche. | 18 - 23 |
| **Insufficiente (< 18)** | Suite di test assente, non funzionante o con test che falliscono nella pipeline CI. | < 18 |

---

### 3. Governance dell'Agente & Human-in-the-Loop (20%)

| Livello | Descrizione | Punteggio |
|---|---|:---:|
| **Eccellente (28 - 30L)** | Tracciabilità esemplare del processo: Sprint Logs documentano chiaramente i task, i piani intermedi approvati (`implementation_plan.md`), le sfide di allucinazione intercettate e corrette manualmente. Commit e PR atomici, chiari e motivati. | 28 - 30L |
| **Buono / Discreto (24 - 27)** | Uso consapevole dell'agente con revisione del codice generato; Sprint Logs presenti e informativi; pochi commit cumulativi. | 24 - 27 |
| **Sufficiente (18 - 23)** | Sprint Logs minimi; evidente accettazione di suggerimenti AI con limitata revisione critica, ma senza gravi difetti architetturali. | 18 - 23 |
| **Insufficiente (< 18)** | Evidente *Vibe Coding*: codice generato in blocco senza piani, commit enormi e privi di contesto, nessuna traccia del controllo dello studente. | < 18 |

---

### 4. Qualità Architetturale, Sicurezza & CI/CD (15%)

| Livello | Descrizione | Punteggio |
|---|---|:---:|
| **Eccellente (28 - 30L)** | Architettura modulare e pulita (separazione netta tra routing, controller, middleware, modelli); gestione robusta dei JWT e delle autorizzazioni; pipeline GitHub Actions sempre verde; rispetto dei principi REST / HATEOAS. | 28 - 30L |
| **Buono / Discreto (24 - 27)** | Codice ben strutturato e funzionante; CI verde; sicurezza base implementata correttamente; piccole ridondanze nel codice. | 24 - 27 |
| **Sufficiente (18 - 23)** | Architettura monolitica o con mescolamento di responsabilità (es. logica di business nei router); CI configurata ma instabile. | 18 - 23 |
| **Insufficiente (< 18)** | Gravi falle di sicurezza (es. secret committati, token non verificati), pipeline CI assente o disabilitata. | < 18 |

---

### 5. Padronanza Tecnica & Difesa Orale (15%)

| Livello | Descrizione | Punteggio |
|---|---|:---:|
| **Eccellente (28 - 30L)** | Lo studente dimostra padronanza assoluta di ogni singola riga di codice (incluso quello generato dall'agente); spiega con chiarezza le scelte architetturali, individua ed effettua modifiche o refactoring live su richiesta della commissione. | 28 - 30L |
| **Buono / Discreto (24 - 27)** | Buona comprensione complessiva del codice e delle dipendenze; risponde con precisione alla maggior parte delle domande architetturali. | 24 - 27 |
| **Sufficiente (18 - 23)** | Comprensione sufficiente del funzionamento generale, ma incertezza su dettagli implementativi generati dall'AI. | 18 - 23 |
| **Insufficiente (< 18)** | Incapacità di spiegare il codice o le librerie utilizzate ("l'ha scritto l'AI"); fallimento nella risoluzione di semplici modifiche live. | < 18 |

---

## 🎯 Checklist di Autovalutazione Finale per gli Studenti

Prima della consegna finale del progetto, verificare:

- [ ] Ogni endpoint implementato è presente in `oas3.yaml` ed è collaudabile via Swagger UI (`/api-docs`).
- [ ] Ogni feature ha la sua specifica compilata secondo [`SPEC_TEMPLATE.md`](file:///Users/marcorobol/Develop/IS/EasyLib/SPEC_TEMPLATE.md).
- [ ] Il comando `npm test` esegue tutti i test con esito positivo (100% pass rate).
- [ ] La pipeline di GitHub Actions è verde su `main` e su tutti i branch di rilascio.
- [ ] Non sono presenti credenziali, secret o file `.env` tracciati nel repository Git.
- [ ] Il registro degli sprint ([Sprint Logs](file:///Users/marcorobol/Develop/IS/EasyLib/README.md#5--diario-delle-iterazioni--changelog-sprint-logs)) è completo e documenta l'interazione con l'agente.
