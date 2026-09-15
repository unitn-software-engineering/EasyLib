# EasyLib Feature Inventory

## Feature Baseline proposta

| ID | Feature | D1 traceability | Priority | Scope | Status |
|---|---|---|---|---|---|
| `FEAT-01` | Authentication | RF1, UC-RF1, US-03, AC, Fig. 1 | MUST | IN | APPROVED |
| `FEAT-02` | User Registration | RF2, UC-RF2 | MUST | IN | APPROVED |
| `FEAT-03` | Book Search | RF3, UC-RF3, US-01/US-02, AC, Fig. 7–8 | MUST | IN | APPROVED |
| `FEAT-04` | Loan Creation | RF4, UC-RF4, US-04/US-06, AC, Fig. 2–3 | MUST | IN | APPROVED |
| `FEAT-05` | Loan Return | RF5, UC-RF5, US-07, AC, Fig. 2 | MUST | IN | APPROVED |
| `FEAT-06` | Loan Extension | RF6, RF9, UC-RF6/UC-RF9, CLAR-EASY-01 | SHOULD | IN | APPROVED |
| `FEAT-07` | Loan History | RF8, UC-RF8, US-05/US-08 | MUST | IN | APPROVED |
| `FEAT-08` | Library Search | RF7, UC-RF7, Fig. 5–6 | SHOULD | IN | DRAFT |
| `FEAT-09` | Notifications | D1 project description, RNF and related AC | SHOULD | IN | DRAFT |
| `FEAT-10` | Localization | RNF5, UI features | SHOULD | IN | APPROVED |
| `FEAT-11` | Book Reservations | D1 project description, GAP-EASY-01 | — | DEFERRED | DEFERRED |

## RNF classification

| RNF | Class | Destination | Evidence |
|---|---|---|---|
| RNF1 Compatibility | SYSTEM-WIDE QUALITY | D2 + verification | Browser/build checks |
| RNF2 Performance | SYSTEM-WIDE QUALITY | D2/D3 + verification | Load/performance evidence |
| RNF3 Scalability | ARCHITECTURE CONSTRAINT | D3 + verification | Architecture/scalability evidence |
| RNF4 Reliability | ARCHITECTURE CONSTRAINT | D3 + verification | Availability/recovery evidence |
| RNF5 Lingua | CROSS-CUTTING CAPABILITY | D2/D3 + verification | Localization checks |
| RNF6 Facilità d'uso | SYSTEM-WIDE QUALITY | D2 + verification | UI/exploratory evidence |

## Quality Gate

- Tutti gli elementi MUST approvati hanno una feature IN.
- `GAP-EASY-01` e `CLAR-EASY-01` sono risolti secondo decisione esplicita.
- La traceability resta da completare per le nuove D2/D3 e per le acceptance evidence.
