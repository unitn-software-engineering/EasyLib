# EasyLib Feature Discovery Decisions

| Decision | Evidenza | Risultato |
|---|---|---|
| MERGE | RF3 ricerca base e US-02/US-03 filtri combinati | `FEAT-03 Book Search` |
| SPLIT | Prestito, restituzione, proroga e storico hanno outcome e scenari distinti | `FEAT-04` … `FEAT-07` |
| DEFER | Prenotazioni citate nella descrizione ma non definite nei requisiti | `FEAT-11` deferred tramite `GAP-EASY-01` |
| KEEP | Login, registrazione, ricerca biblioteche e localizzazione hanno confini riconoscibili | Feature separate |
