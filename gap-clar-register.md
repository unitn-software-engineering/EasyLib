# EasyLib GAP and CLAR Register

| ID | Type | Decision | Status | Impact |
|---|---|---|---|---|
| `GAP-EASY-01` | GAP | Prenotazioni libri deferred; non implementate nella release corrente. | RESOLVED | Feature Discovery, D2/D3 e backlog |
| `CLAR-EASY-01` | CLAR | La proroga è gestita dall'operatore e aggiunge 30 giorni alla scadenza corrente. La richiesta autonoma dell'utente è deferred. | RESOLVED | RF6/RF9, D2, API e test |
| `CLAR-EASY-02` | CLAR | La restituzione chiude il prestito mantenendo il record nello storico, con stato `returned` e `returnedAt`. | RESOLVED | RF5, US-07, modello, API e frontend |
| `CLAR-EASY-03` | CLAR | Gli utenti gestiscono solo i propri prestiti; gli operatori possono gestire catalogo e prestiti di tutti gli utenti. | RESOLVED | Auth, middleware e tutte le route protette |
| `CLAR-EASY-04` | CLAR | Le notifiche sono locali e persistenti, senza invio email; il boundary resta sostituibile per eventuali evoluzioni future. | RESOLVED | D3 integrazioni esterne, modello e frontend |

## Decisioni di scope

- Login locale e Google: IN.
- Registrazione utente: IN.
- Ricerca libri e CRUD catalogo: IN; CRUD riservato all'operatore.
- Creazione prestito, restituzione, proroga operatore e storico: IN.
- Ricerca biblioteche: IN se il dataset/source viene definito nel D3.
- Prenotazioni: DEFERRED.
- Richiesta autonoma di proroga dell'utente: DEFERRED; la proroga operativa resta IN.
- Notifiche: IN come comportamento; implementate localmente e persistenti, senza email.
- Interfaccia italiana, inglese e tedesca: IN.

## Nota sul documento

Questo registro rappresenta lo stato corrente delle decisioni di scope e chiarimento. Non è una cronologia completa delle conversazioni: la storia delle modifiche è tracciata nei commit Git e nelle specifiche versionate.
