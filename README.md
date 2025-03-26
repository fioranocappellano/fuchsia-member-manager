
# Judgment Fleet - Web Application

This is the official web application for Judgment Fleet, an exclusive hub for Italian competitive Pokémon players.

## Project Architecture

This project follows a clear separation between the frontend and backend parts of the application:

```
src/
├── frontend/     # Frontend-specific code
├── backend/      # Backend-specific code
├── components/   # Shared components
├── contexts/     # Application contexts
├── hooks/        # Shared custom hooks
├── lib/          # Utility functions and helpers
├── locales/      # Internationalization resources
├── pages/        # Page components
└── integrations/ # Integration with external services
```

### Frontend-Backend Separation

The application follows a clean separation of concerns:

- **Frontend**: Handles the UI, user interactions, and presentation logic.
- **Backend**: Manages data operations, API calls, and business logic.

## Key Components and Features

### 1. Frontend Layer

Located in `src/frontend/`:

- **Pages**: Individual application pages
- **Components**: UI components specific to the frontend
- **Contexts**: Context providers for frontend state management
- **Hooks**: Custom hooks for frontend logic

### 2. Backend Layer

Located in `src/backend/`:

- **API**: API client code for interfacing with the backend services
- **Services**: Business logic and data processing
- **Models**: Data models and type definitions
- **Utils**: Backend-specific utility functions

### 3. Shared Resources

Resources shared between frontend and backend:

- **Components**: Reusable UI components
- **Contexts**: Application-wide state management
- **Hooks**: Shared custom hooks
- **Utils**: Utility functions used by both frontend and backend

## File Structure Overview

### API Module (`src/backend/api/`)

The API module handles data operations and communicates with the Supabase backend.

| File | Description |
|------|-------------|
| `auth.ts` | Authentication operations (login, logout, password reset) |
| `games.ts` | Game management operations (CRUD for games) |
| `members.ts` | Member management operations (CRUD for team members) |
| `faqs.ts` | FAQ management operations |
| `index.ts` | API exports |

### Frontend Pages (`src/frontend/pages/`)

| File | Description |
|------|-------------|
| `Index.tsx` | Main landing page of the application |

### Components (`src/frontend/components/`)

| Component | Description |
|-----------|-------------|
| `JudgmentFleetBanner.tsx` | Banner component with team name and description |
| `Hero.tsx` | Hero section of the homepage |
| `Community.tsx` | Community section of the homepage |
| `TopMembers.tsx` | Section displaying top team members |
| `Footer.tsx` | Footer component with links and information |
| `PlayerCard.tsx` | Card component for displaying player information |
| `ui/*` | UI components based on shadcn/ui library |

### Contexts (`src/contexts/`)

| Context | Description |
|---------|-------------|
| `LanguageContext.tsx` | Handles internationalization and language switching |
| `AuthContext.tsx` | Manages user authentication state |

### Frontend Hooks (`src/frontend/hooks/`)

| Hook | Description |
|------|-------------|
| `use-toast.ts` | Hook for displaying toast notifications |
| `useMemberManager.tsx` | Hook for managing members in the admin panel |
| `useGameManager.tsx` | Hook for managing games in the admin panel |
| `usePasswordReset.tsx` | Hook for password reset functionality |

## Data Flow

1. **User Interaction**: User interacts with a frontend component
2. **Frontend Logic**: Frontend hook or component calls backend API
3. **API Call**: Backend API module makes request to external service (Supabase)
4. **Data Processing**: Data is processed by backend service
5. **State Update**: Frontend state is updated based on API response
6. **UI Update**: UI is updated to reflect the new state

## Backend Integration

The application uses Supabase as the backend service, with the following tables:

- `members`: Team member information
- `best_games`: Notable games played by team members
- `faqs`: Frequently asked questions
- `footer_resources`: Resources displayed in the footer
- `admins`: Administrator accounts

## Authentication Flow

1. User enters credentials in the Auth page
2. Auth API sends credentials to Supabase
3. Upon successful authentication, user state is updated
4. Admin check is performed to determine user role
5. User is redirected based on their role

## Internationalization

The application supports multiple languages with a context-based approach:

- Language files in `src/locales/` (en.ts, it.ts)
- LanguageContext manages current language
- Components use translations via useLanguage hook

## Building and Deployment

1. Build frontend and backend together
2. Deploy to hosting provider
3. Connect to Supabase backend services

## Future Extensions

- User profiles for team members
- Event management
- Tournament tracking
- Chat functionality

---

This architecture allows for clean separation of concerns while maintaining a consistent development experience across the application.

