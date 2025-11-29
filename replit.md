# FinEdu AZ - Financial Education Platform

## Overview

FinEdu AZ is a multilingual financial education web application designed for the Azerbaijan market. It provides personal finance management tools, AI-powered financial advice, savings goal tracking, and gamified friend competitions. The platform supports three languages (Azerbaijani, English, and Russian) and uses Google OAuth for authentication.

The application helps users track income/expenses, compare their spending against regional averages, set and monitor savings goals, compete with friends in savings challenges, and receive personalized AI financial advice through "Finny," an AI assistant powered by OpenAI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components (Radix UI primitives) with Tailwind CSS for styling. The design system follows a modern fintech aesthetic inspired by apps like Revolut and N26, emphasizing trust, clarity, and professional financial presentation.

**Routing**: wouter - a minimal client-side router for single-page application navigation.

**State Management**: 
- React Context for global state (authentication, language preferences)
- TanStack Query (React Query) for server state management and API caching
- React Hook Form with Zod for form validation

**Styling**: Tailwind CSS with custom design tokens defined in CSS variables for theming (light/dark mode support). Typography uses Inter font for optimal financial data readability.

**Key Design Decisions**:
- Component-based architecture with reusable UI components in `/client/src/components/ui`
- Page-level components in `/client/src/pages` for each major feature
- Custom hooks for mobile detection and toast notifications
- Multilingual support through translation files with context-based language switching

### Backend Architecture

**Runtime**: Node.js with Express.js framework for the HTTP server.

**Data Storage**: JSON file-based storage system (no traditional database). Data is persisted in JSON files under `/data` directory:
- `users.json` - User profiles and registration data
- `transactions.json` - Income and expense records
- `goals.json` - Savings goals and progress
- Friend requests and relationships (structure in schema)

**Storage Abstraction**: Custom IStorage interface in `/server/storage.ts` provides CRUD operations for all data entities. This abstraction allows future migration to a real database without changing API layer code.

**Session Management**: express-session middleware with secure cookie-based sessions for authentication state.

**API Design**: RESTful API endpoints organized in `/server/routes.ts`:
- `/api/auth/*` - Authentication (Google OAuth simulation, login, logout)
- `/api/transactions` - Income/expense CRUD operations
- `/api/goals` - Savings goals management
- `/api/finny/*` - AI assistant interactions
- `/api/averages` - Regional spending comparisons
- `/api/friends/*` - Social features (friend requests, race competition)

**Rationale for JSON Storage**: Chosen for simplicity and rapid prototyping. The storage layer is designed with a clean interface to allow easy migration to PostgreSQL/Drizzle ORM later (configuration files already present for future migration).

### Authentication & Authorization

**Authentication Strategy**: Google OAuth (currently simplified implementation storing email-based sessions).

**Session Flow**:
1. User initiates Google login
2. Email captured and temporary session created
3. If new user, profile completion required (name, age, region, gender)
4. Session persisted with `userId` reference
5. Protected routes check session validity via middleware

**Authorization**: Simple session-based authorization using `requireAuth` middleware. All API routes except `/api/auth/*` require valid session.

### AI Integration

**Provider**: OpenAI GPT-4 API for the "Finny" AI financial advisor feature.

**Use Cases**:
- Personalized spending analysis based on user transaction history
- Monthly financial advice and recommendations
- Savings tips and budget planning guidance
- Answers to user financial questions

**Implementation**: Direct API calls to OpenAI with context built from user's financial data, regional averages, and transaction patterns.

### Data Analysis Features

**Regional Comparisons**: The application analyzes spending patterns across different cities in Azerbaijan and age groups (14-18, 19-25, 26+). This data comes from a pre-loaded dataset (`finedu_data.json` referenced in requirements) to provide users with comparative insights.

**Calculation Logic**: Server-side aggregation of transaction data to compute monthly totals, category breakdowns, and comparison metrics against demographic averages.

### Internationalization (i18n)

**Supported Languages**: Azerbaijani (default), English, Russian.

**Implementation**: Translation object mapping in `/client/src/lib/translations.ts` with a language context provider. Language preference stored in localStorage and synchronized across the application.

**Language Switcher**: Fixed-position UI component (bottom-left) with flag/text buttons for quick language switching.

### Build & Deployment

**Development**: 
- Vite dev server with HMR for frontend
- tsx for running TypeScript backend with hot reload
- Concurrent development of client and server

**Production Build**:
- Vite builds client into `/dist/public`
- esbuild bundles server code into single CommonJS file at `/dist/index.cjs`
- Static file serving from Express for built client assets

**Build Script**: Custom build script (`/script/build.ts`) that:
1. Cleans dist directory
2. Builds client with Vite
3. Bundles server with esbuild (selective external dependencies)
4. Creates production-ready artifact

## External Dependencies

### Third-Party Libraries

**UI & Styling**:
- Radix UI - Accessible component primitives (@radix-ui/react-*)
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe CSS class composition
- Lucide React - Icon library
- react-icons - Additional icon sets (Google icon)

**Forms & Validation**:
- React Hook Form - Form state management
- Zod - Schema validation
- @hookform/resolvers - Hook Form + Zod integration

**Data Fetching & State**:
- TanStack Query - Server state management and caching
- wouter - Lightweight routing

**Date Handling**:
- date-fns - Date manipulation and formatting

**AI Services**:
- OpenAI - GPT API client for financial advice features

**Session & Storage**:
- express-session - Session middleware
- connect-pg-simple - PostgreSQL session store (configured but not yet used)

### Database Configuration (Future Migration)

**Planned Database**: PostgreSQL via Neon serverless (@neondatabase/serverless)

**ORM**: Drizzle ORM with Drizzle Kit for migrations

**Current Status**: Configuration files present (`drizzle.config.ts`, schema definitions in `/shared/schema.ts`) but not actively used. The application currently uses JSON file storage with plans to migrate to PostgreSQL when needed.

**Migration Path**: The IStorage interface abstraction allows switching from JSON to Drizzle without changing route handlers.

### Environment Variables

**Required**:
- `DATABASE_URL` - PostgreSQL connection string (for future migration)
- `OPENAI_API_KEY` - OpenAI API key for Finny AI features
- `SESSION_SECRET` - Secret key for session encryption
- `NODE_ENV` - Environment flag (development/production)

### External Services

**Google OAuth**: Authentication provider (simplified implementation, ready for full OAuth2 flow integration)

**OpenAI API**: Powers the Finny AI financial advisor with GPT-4 model for generating personalized financial advice and answering user questions.