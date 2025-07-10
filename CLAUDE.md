# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ahmed Urkmez Full-Stack Application - A TypeScript-based academic portfolio website built with Next.js frontend, NestJS backend, and PostgreSQL database. The application features a modern Seljuk art-inspired design system and includes authentication, content management, and academic paper/article publishing capabilities.

## Architecture

### Monorepo Structure
- `apps/client/` - Next.js 15 frontend with TypeScript and Tailwind CSS
- `apps/server/` - NestJS 11 backend with TypeORM and PostgreSQL
- `docker/` - Database configuration and Docker Compose setup

### Backend Architecture (NestJS)
- **Modular Design**: Feature-based modules (articles, auth, categories, comments, contacts, users, admin, mail, upload)
- **Security**: JWT authentication with Passport.js, role-based access control (RBAC), rate limiting
- **Database**: PostgreSQL with TypeORM, entity-based design with proper relationships
- **Validation**: Class-validator with DTOs for input validation
- **Mail**: Handlebars templates with nodemailer integration

### Frontend Architecture (Next.js)
- **App Router**: Using Next.js 15 app directory structure
- **State Management**: React Context for authentication state
- **UI Framework**: Tailwind CSS with custom design system based on Seljuk art
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios with API interceptors

## Development Commands

### Initial Setup
```bash
# Start PostgreSQL database
docker-compose up -d

# Backend setup and development
cd apps/server
npm install
npm run start:dev    # Development server on port 3001

# Frontend setup and development  
cd apps/client
npm install
npm run dev          # Development server on port 3000
```

### Backend Commands (apps/server)
```bash
npm run start:dev     # Development mode with hot reload
npm run build         # Production build
npm run start:prod    # Start production server
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run test          # Unit tests with Jest
npm run test:watch    # Watch mode for tests
npm run test:cov      # Test coverage
npm run test:e2e      # End-to-end tests
npm run create-admin  # Create admin user script
```

### Frontend Commands (apps/client)
```bash
npm run dev          # Development with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Next.js ESLint
```

## Key Configuration

### Environment Variables
- **Server (.env)**: Database connection, JWT secrets, mail configuration
- **Client (.env.local)**: API URL (`NEXT_PUBLIC_API_URL=http://localhost:3001`)

### Database
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)
- **Connection**: PostgreSQL on localhost:5432

## Code Conventions

### Backend (NestJS)
- **Module Structure**: Each feature has controller, service, module, and DTOs
- **Entity Design**: TypeORM entities with proper relationships and audit fields
- **Authentication**: JWT with role-based guards and decorators
- **Validation**: Class-validator decorators on DTOs
- **Error Handling**: NestJS HTTP exceptions

### Frontend (Next.js)
- **Components**: Organized by type (auth, layout, pages, ui, admin, article)
- **Styling**: Tailwind CSS with Seljuk art-inspired custom design system
- **State**: React Context for global state, local state for components
- **Types**: Centralized in `src/types/index.ts`
- **API**: Centralized HTTP client in `src/lib/api.ts`

## Design System

The application uses a custom design system inspired by modern Seljuk art:
- **Colors**: Cream/neutral backgrounds, teal/turkuaz accents, burgundy highlights, brown text
- **Typography**: Crimson Text primary font with serif characteristics
- **Components**: Custom buttons, cards, and form elements with gradient backgrounds
- **Animations**: 300ms transitions with scale and shadow effects

## Important Notes

- **Authentication**: JWT-based with roles (admin, user), protected routes use `ProtectedRoute` component
- **File Uploads**: Handled by dedicated upload module, files served from `/uploads` endpoint
- **Email System**: Contact forms trigger email notifications using Handlebars templates
- **Content Types**: Articles support multiple types (blog posts, academic papers) with media attachments
- **Security**: CORS configured, rate limiting enabled, bcrypt for passwords, Helmet for headers
- **Database**: Auto-sync in development, consider manual migrations for production

## Testing

- **Backend**: Jest for unit/integration tests, separate e2e test configuration
- **Frontend**: Built-in Next.js testing capabilities
- **Database**: Uses test environment configuration when running tests

## Deployment Considerations

- **Production Build**: Run `npm run build` in both client and server
- **Environment**: Ensure production environment variables are configured
- **Database**: Consider using manual migrations instead of auto-sync in production
- **Static Files**: Upload directory needs to be persistent in production deployment