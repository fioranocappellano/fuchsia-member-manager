
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
│   └── types/            # Tipi TypeScript per il frontend
│
├── backend/              # Tutto il codice relativo al backend
│   └── api/              # Moduli API per comunicare con il database
│
├── contexts/             # Context providers React
├── hooks/                # Hook globali condivisi
├── integrations/         # Integrazioni con servizi esterni (Supabase)
├── pages/                # Componenti pagina
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

## Moduli Principali

### API Backend

- **membersApi**: Gestisce tutte le operazioni CRUD per i membri del team.
- **gamesApi**: Gestisce le operazioni relative ai migliori giochi.
- **faqApi**: Gestisce le FAQ del sito.
- **authApi**: Gestisce l'autenticazione degli utenti e le operazioni correlate.

### Context

- **LanguageContext**: Gestisce l'internazionalizzazione del sito.
- **AuthContext**: Gestisce lo stato di autenticazione dell'utente.

### Hooks

- **usePasswordReset**: Gestisce il processo di reset della password.
- **useGameManager**: Gestisce la logica per la gestione dei giochi.
- **useMemberManager**: Gestisce la logica per la gestione dei membri.
- **useFAQManager**: Gestisce la logica per la gestione delle FAQ.

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
