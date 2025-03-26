
# Judgment Fleet Website

This repository contains the code for the Judgment Fleet website, an elite Pokémon competitive team. The codebase is organized with a clear separation between frontend and backend components, making it maintainable and easy to understand.

## Project Structure

The project is organized into two main directories:

```
src/
├── frontend/           # Frontend components, hooks, contexts, and pages
│   ├── components/     # UI components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── backend/           # Backend API and services
│   ├── api/           # API endpoints
│   └── services/      # Backend services
└── integrations/      # Third-party integrations
    └── supabase/      # Supabase client and types
```

## Architecture Overview

This application follows a clean architecture pattern with clear separation of concerns:

1. **Frontend Layer**: Contains all UI components, pages, and client-side logic
2. **Backend Layer**: Handles data fetching, manipulation, and business logic
3. **Integration Layer**: Manages connections to external services (Supabase in this case)

## Frontend Components

### Core Components

- **Navbar**: Main navigation component that allows users to navigate between different sections of the site
- **Hero**: The main landing section of the homepage
- **Community**: Section showcasing the community aspects of Judgment Fleet
- **TopMembers**: Component displaying the team's top members with their achievements
- **PlayerCard**: Individual card displaying a team member's information
- **LanguageSelector**: Component for switching between Italian and English languages
- **Footer**: Footer component with links and copyright information

### Admin Components

- **GameManager**: Component for managing best games with CRUD operations
- **MemberManager**: Component for managing team members with CRUD operations
- **FAQManager**: Component for managing FAQ entries with CRUD operations

### UI Components

Various UI components from the shadcn/ui library, customized for the Judgment Fleet design system.

## Backend API

The backend layer is organized into API modules that handle specific data entities:

### Members API

The `membersApi` object provides the following functions:

- `getAll()`: Fetches all team members from the database
- `getById(id)`: Fetches a specific member by ID
- `create(member)`: Creates a new team member
- `update(id, member)`: Updates an existing team member
- `delete(id)`: Deletes a team member
- `swapPositions(member1, member2)`: Swaps the positions of two members for reordering

### Games API

The `gamesApi` object provides the following functions:

- `getAll()`: Fetches all best games from the database
- `getById(id)`: Fetches a specific game by ID
- `create(game)`: Creates a new best game
- `update(id, game)`: Updates an existing best game
- `delete(id)`: Deletes a best game
- `swapPositions(game1, game2)`: Swaps the positions of two games for reordering

### FAQs API

The `faqsApi` object provides similar CRUD operations for FAQ entries.

### Auth API

The `authApi` object handles authentication and user management:

- `signIn(email, password)`: Authenticates a user
- `signOut()`: Signs out the current user
- `checkIsAdmin(userId)`: Checks if a user has admin privileges
- `resetPassword(email)`: Initiates a password reset process
- `updatePassword(newPassword)`: Updates a user's password
- `getCurrentUser()`: Retrieves the currently authenticated user

## Contexts

### LanguageContext

Provides internationalization capabilities:

- `locale`: Current language (it/en)
- `translations`: Text translations for the current language
- `setLocale(locale)`: Function to change the current language

### AuthContext

Manages user authentication state:

- `user`: Current authenticated user or null
- `isAdmin`: Boolean indicating if the current user has admin privileges
- `loading`: Loading state for authentication
- `signIn(email, password)`: Function to sign in a user
- `signOut()`: Function to sign out the current user

## Hooks

### use-toast

Custom hook for displaying toast notifications. Used throughout the application to provide user feedback.

### useGameManager

Manages the state and operations for the game management interface:

- Fetching, creating, updating, and deleting games
- Handling reordering of games
- Managing UI state (loading, dialog open/close, etc.)

### useMemberManager

Similar to useGameManager but for team members.

### useFAQManager

Similar to useGameManager but for FAQ entries.

## Database Schema

The application uses Supabase as its backend database with the following main tables:

- **members**: Stores team member information
- **best_games**: Stores the best games showcase
- **faqs**: Stores FAQ entries
- **admins**: Stores admin user information

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Environment Variables

The application uses the following environment variables:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key for client-side operations

## Deployment

The application is deployed using Netlify, with continuous deployment set up from the main branch.

## Credits

- **UI Framework**: React with Vite
- **Styling**: Tailwind CSS with custom theme
- **Backend**: Supabase for authentication, database, and storage
- **Icons**: Lucide React
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
