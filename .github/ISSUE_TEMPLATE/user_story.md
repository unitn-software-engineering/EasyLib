---
name: User Story (Spec-Driven)
about: Proponi una nuova User Story con criteri di accettazione Gherkin
title: "[US-XX] Titolo sintetico della User Story"
labels: ["user-story", "spec-driven"]
assignees: ''
---

## 🎯 User Story

```text
Come [Ruolo: Studente / Bibliotecario / Admin],
Voglio [Azione / Funzionalità],
Per [Valore / Beneficio].
```

---

## 📋 Criteri di Accettazione (Gherkin)

```gherkin
Scenario: [Happy Path]
  Given [Precondizione]
  When [Azione]
  Then [Risultato atteso]

Scenario: [Errore / Edge Case]
  Given [Precondizione non valida]
  When [Azione]
  Then [Risultato di errore atteso]
```

---

## 📐 Impatto su Contratti & Modelli

- **Endpoint REST previsti**: `[es. POST /api/v1/...]`
- **Modelli dati coinvolti**: `[es. Book, Student, Booklending]`
- **Specifica associata**: `[ ] Da redigere in specs/US-XX.md`
