## 🎯 Descrizione della Pull Request

Breve riassunto delle modifiche introdotte e motivazione.

- **ID Feature / User Story**: `[es. US-07]`
- **Specifica di riferimento**: `[Link a specs/US-XX.md]`

---

## 🔍 Riepilogo Modifiche

- [ ] **Modello Dati**: `[Modifiche a Mongoose models o schemi]`
- [ ] **Contratti API**: `[Nuove rotte / modifiche in oas3.yaml]`
- [ ] **Backend**: `[Controller / Middleware / Routes]`
- [ ] **Frontend**: `[Componenti Vue / Viste / Router]`
- [ ] **Test**: `[Test di unità e integrazione aggiunti/aggiornati]`

---

## 🧪 Strategia di Test & Risultati

Descrivere i test eseguiti per validare i criteri di accettazione:

```bash
# Comando eseguito:
npm test
```

- [ ] Tutti i test esistenti e nuovi passano al 100%.
- [ ] Copertura dei casi di errore documentati nella specifica (400, 401, 404, 409).

---

## ✅ Checklist di Conformità Spec-Driven Development (DoD)

Prima di richiedere la review o fare il merge, spuntare tutte le voci obbligatorie:

- [ ] **Specifica Completa**: La specifica in `specs/` è approvata e compilata in ogni sua parte.
- [ ] **OpenAPI 3.0**: Il file `oas3.yaml` è sincronizzato con l'implementazione e navigabile da `/api-docs`.
- [ ] **Invarianti di Business**: Le invarianti di sicurezza e dominio definite nella specifica non sono violate.
- [ ] **Nessun Secret**: Verificato che non siano presenti API key, password o token nel codice.
- [ ] **Human-in-the-Loop Review**: Il codice generato dall'agente AI è stato revisionato criticamente riga per riga.
- [ ] **Continuous Integration**: La pipeline GitHub Actions è verde su questo branch.
