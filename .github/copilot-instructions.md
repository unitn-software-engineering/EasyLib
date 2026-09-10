# GitHub Copilot Instructions — Spec-Driven Development (EasyLib)

Consulta e rispetta rigorosamente le regole e le invarianti definite in [AGENTS.md](../AGENTS.md).

### Regole Chiave per Copilot:
1. Non generare codice senza fare riferimento a una specifica (in `specs/`, `SPEC_TEMPLATE.md` o `oas3.yaml`).
2. Rispetta lo stack: Node.js 22 (ES Modules `import/export`), Express 5, Mongoose 8, Vue 3.
3. Rispetta la convenzione REST e i codici di errore documentati in `oas3.yaml`.
4. Proteggi le rotte private con il middleware `tokenChecker`.
5. Proponi o aggiorna sempre i test automatici Jest in `app/*.test.js` a supporto di ogni modifica.
