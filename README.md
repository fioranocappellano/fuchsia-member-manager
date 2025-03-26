
# Judgment Fleet - Architettura del Sistema

## Panoramica

Questo progetto è un'applicazione web per la community di Judgment Fleet, con una chiara separazione tra frontend e backend.

L'applicazione è strutturata secondo il pattern architetturale Frontend-Backend, facilitando la manutenzione, il testing e la possibilità di sostituire facilmente l'implementazione del backend (ad esempio passando da Supabase a un altro servizio) senza modificare il frontend.

## Struttura delle Cartelle

```
src/
├── frontend/             # Tutto il codice relativo al frontend
│   ├── components/       # Componenti UI riutilizzabili
│   ├── hooks/            # Hook personalizzati React
│   ├── pages/            # Componenti pagina
│   ├── contexts/         # Context providers React
│   ├── utils/            # Utility funzioni per il frontend
│   └── types/            # Tipi TypeScript per il frontend
│
├── backend/              # Tutto il codice relativo al backend
│   └── api/              # Moduli API per comunicare con il database
│
├── integrations/         # Integrazioni con servizi esterni (Supabase)
├── contexts/             # Context providers React globali
├── hooks/                # Hook globali condivisi
└── utils/                # Utility funzioni condivise
```

## Architettura Frontend-Backend

### Frontend

- **Interfaccia Utente**: Implementata con React, React Router, e Tailwind CSS.
- **Gestione Stato**: Utilizzo di React Context e TanStack Query per la gestione dello stato globale e delle richieste dati.
- **Componenti**: Organizzati in modo modulare, riutilizzabili e focalizzati su specifiche funzionalità.
- **Internazionalizzazione**: Supporto multilingua tramite il LanguageContext.

### Backend

- **API**: Interfacce ben definite per tutte le operazioni di dati.
- **Implementazione**: Attualmente basata su Supabase, ma facilmente sostituibile.
- **Servizi**: Moduli separati per membri, giochi, FAQ e autenticazione.

## Moduli Principali e Loro Funzioni

### API Backend

#### membersApi
- **getAll()**: Recupera tutti i membri ordinati per posizione.
- **getById(id)**: Recupera un membro specifico tramite ID.
- **create(member)**: Crea un nuovo membro.
- **update(id, member)**: Aggiorna un membro esistente.
- **delete(id)**: Elimina un membro.
- **swapPositions(member1, member2)**: Scambia la posizione di due membri.

#### gamesApi
- **getAll()**: Recupera tutti i giochi ordinati per posizione.
- **getById(id)**: Recupera un gioco specifico tramite ID.
- **create(game)**: Crea un nuovo gioco.
- **update(id, game)**: Aggiorna un gioco esistente.
- **delete(id)**: Elimina un gioco.
- **swapPositions(game1, game2)**: Scambia la posizione di due giochi.

#### faqsApi
- **getAll()**: Recupera tutte le FAQ attive.
- **getAllForAdmin()**: Recupera tutte le FAQ (attive e non) per l'admin.
- **getById(id)**: Recupera una FAQ specifica tramite ID.
- **create(faq)**: Crea una nuova FAQ.
- **update(id, faq)**: Aggiorna una FAQ esistente.
- **delete(id)**: Elimina una FAQ.
- **swapPositions(faq1, faq2)**: Scambia la posizione di due FAQ.

#### authApi
- **signIn(email, password)**: Effettua il login di un utente.
- **signOut()**: Effettua il logout dell'utente corrente.
- **checkIsAdmin(userId)**: Verifica se l'utente è un amministratore.
- **resetPassword(email)**: Invia un'email per il reset della password.
- **updatePassword(newPassword)**: Aggiorna la password dell'utente.
- **getCurrentUser()**: Ottiene l'utente corrente dalla sessione.

### Componenti Frontend

#### Navbar
- Gestisce la navigazione tra le pagine e le sezioni.
- Supporta sia la navigazione desktop che mobile.
- Mostra linguette extra per gli admin.

#### JudgmentFleetBanner
- Mostra lo sfondo con il nome del team.
- Applica animazioni all'entrata.

#### PlayerCard
- Visualizza informazioni di un membro del team.
- Gestisce errori di caricamento immagini con fallback.
- Mostra collegamenti ai profili Smogon.

#### TopMembers
- Visualizza tutti i membri del team.
- Gestisce la logica di caricamento e visualizzazione.
- Aggiorna i dati in tempo reale con Supabase.

#### LanguageSelector
- Permette agli utenti di cambiare lingua.
- Mantiene la posizione di scroll durante il cambio.

#### Footer
- Mostra informazioni di contatto e risorse.
- Carica risorse dinamicamente dal database.

### Hooks Frontend

#### usePasswordReset
- **resetPassword(email)**: Gestisce la richiesta di reset della password.
- Integra notifiche toast per feedback all'utente.

#### useGameManager
- **fetchGames()**: Carica i giochi dal database.
- **handleEdit(game)**: Prepara un gioco per la modifica.
- **handleDelete(id)**: Elimina un gioco.
- **handleUpdate(values)**: Aggiorna un gioco esistente.
- **moveItem(id, direction)**: Sposta un gioco nell'ordine.
- **toggleReordering()**: Attiva/disattiva la modalità riordinamento.

#### useMemberManager
- **fetchMembers()**: Carica i membri dal database.
- **handleEdit(member)**: Prepara un membro per la modifica.
- **handleDelete(id)**: Elimina un membro.
- **handleUpdate(values)**: Aggiorna un membro esistente.
- **moveItem(id, direction)**: Sposta un membro nell'ordine.
- **toggleReordering()**: Attiva/disattiva la modalità riordinamento.

#### useFAQManager
- **fetchFaqs()**: Carica le FAQ dal database.
- **handleEdit(faq)**: Prepara una FAQ per la modifica.
- **handleDelete(id)**: Elimina una FAQ.
- **handleUpdate(values)**: Aggiorna una FAQ esistente.
- **handleToggleActive(id, isActive)**: Attiva/disattiva una FAQ.
- **moveItem(id, direction)**: Sposta una FAQ nell'ordine.
- **toggleReordering()**: Attiva/disattiva la modalità riordinamento.

### Utils Frontend

#### imageUtils
- **normalizeImageUrl(imagePath)**: Normalizza gli URL delle immagini per garantire che siano corretti.

### Contexts

#### LanguageContext
- Gestisce lo stato della lingua corrente (italiano/inglese).
- Fornisce le traduzioni appropriate in base alla lingua selezionata.

#### AuthContext
- Gestisce lo stato di autenticazione dell'utente.
- Verifica se l'utente è un amministratore.
- Fornisce funzioni di login/logout.

## Flusso dei Dati

1. I componenti React nel frontend utilizzano hooks personalizzati per accedere alle funzionalità.
2. Gli hooks interagiscono con l'API del backend quando necessario.
3. L'API del backend comunica con Supabase per le operazioni sul database.
4. I risultati vengono restituiti al frontend attraverso l'interfaccia API.

## Vantaggi dell'Architettura

1. **Separazione delle Responsabilità**: Frontend e backend chiaramente separati con interfacce ben definite.
2. **Sostituibilità**: Possibilità di sostituire l'implementazione backend senza modificare il frontend.
3. **Testabilità**: Componenti e moduli possono essere testati in isolamento.
4. **Manutenibilità**: Struttura organizzata che facilita l'aggiunta di nuove funzionalità.
5. **Scalabilità**: L'architettura supporta la crescita del progetto mantenendo la qualità del codice.

## Tecnologie Utilizzate

- **Frontend**: React, TypeScript, Tailwind CSS, TanStack Query, Framer Motion
- **Backend**: Supabase (Database, Autenticazione, Storage)
- **Strumenti di Build**: Vite

## TO-DO:
1) Implementare una SEO più efficiente
2) Miglioramenti Admin Dashboard
3) Sistemare Bottoni Homepage
4) Possibile Dashboard Statistiche
