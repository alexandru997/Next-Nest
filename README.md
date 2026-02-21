# Sustainability Dashboard


A full-stack web application for tracking corporate environmental metrics — CO₂ emissions, energy consumption, water usage, waste generation and renewable energy adoption — with goal-setting and progress visualisation.

Built as a portfolio project demonstrating production-grade patterns across the entire stack.

---

## Tech Stack

**Backend**
- [NestJS 11](https://nestjs.com/) — modular Node.js framework
- [GraphQL](https://graphql.org/) via Apollo Server — primary API layer
- [Prisma 7](https://www.prisma.io/) — type-safe ORM with PostgreSQL
- [JWT](https://jwt.io/) — stateless authentication
- REST endpoints for health check, CSV import/export and analytics

**Frontend**
- [Next.js 16](https://nextjs.org/) App Router — server and client components
- [React 19](https://react.dev/) — UI layer
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling
- [Recharts](https://recharts.org/) — data visualisation
- Native `fetch` against GraphQL (no Apollo Client at runtime)

**Infrastructure**
- [PostgreSQL](https://www.postgresql.org/) — relational database
- [Docker Compose](https://docs.docker.com/compose/) — local database container
- [GitHub Actions](https://github.com/features/actions) — CI pipeline (lint + typecheck + build)

---

## Features

- **Authentication** — register / login with hashed passwords and JWT cookies
- **Companies** — create and delete tracked organisations
- **Emission Reports** — log CO₂, energy, water, waste and renewable % per year / quarter
- **Reduction Goals** — set baseline → target reduction goals per metric
- **Charts** — bar chart showing emission trends per company
- **Analytics REST API** — aggregated summary across all companies
- **CSV export / import** — bulk report management via REST
- **CI/CD** — automated lint, TypeScript checks and production build on every push

---

## Architecture

```
sustainability-dashboard/
├── server/                  # NestJS API
│   ├── src/
│   │   ├── auth/            # Register, login, JWT guard, CurrentUser decorator
│   │   ├── company/         # Company CRUD resolver + service
│   │   ├── report/          # EmissionReport resolver + service
│   │   ├── goal/            # ReductionGoal resolver + service
│   │   ├── rest/            # Health, CSV, analytics REST controller
│   │   ├── prisma/          # PrismaService (singleton)
│   │   └── common/          # Guards, decorators, shared types
│   └── prisma/
│       └── schema.prisma    # Single source of truth for DB schema
│
└── client/                  # Next.js App Router
    ├── app/
    │   ├── page.tsx                     # Login / Register (client component)
    │   └── (protected)/                 # Route group — requires valid cookie
    │       ├── layout.tsx               # Server component: auth check + Navbar
    │       ├── dashboard/page.tsx       # Server component: company list + analytics
    │       └── companies/
    │           ├── page.tsx             # Server component: company table
    │           └── [id]/page.tsx        # Server component: reports + goals
    ├── components/                      # UI components (server + client split)
    ├── hooks/                           # useReports, useGoals — optimistic state
    ├── lib/graphql/                     # server-fetch.ts, client-fetch.ts, queries, mutations
    └── types/                           # Shared TypeScript interfaces
```

**Data flow:**
- Protected pages are **Server Components** — they read the JWT from a cookie server-side and fetch data before the response is sent to the browser, with no client-side loading states.
- Interactive sections (forms, delete buttons, charts) are **Client Components** that call a typed `clientFetch` helper and use `router.refresh()` to re-sync server state after mutations.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- Docker Desktop (for the local PostgreSQL container)
- npm

### 1 — Clone and install

```bash
git clone https://github.com/alexandru997/Next-Nest.git
cd Next-Nest

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2 — Start the database

```bash
# From the project root
docker compose up -d
```

This starts a PostgreSQL instance on port **5433**.

### 3 — Configure environment variables

**server/.env**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sustainability"
JWT_SECRET="change-this-in-production"
PORT=4000
```

**client/.env.local**
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4 — Run database migrations

```bash
cd server
npx prisma migrate dev
```

### 5 — Start the servers

```bash
# Terminal 1 — API (http://localhost:4000)
cd server && npm run start:dev

# Terminal 2 — Frontend (http://localhost:3000)
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account and start adding companies.

---

## API Reference

### GraphQL — `POST /graphql`

Playground available at [http://localhost:4000/graphql](http://localhost:4000/graphql) in development.

All mutations and queries (except `login` / `register`) require an `Authorization: Bearer <token>` header.

| Operation | Type | Description |
|-----------|------|-------------|
| `register(input)` | Mutation | Create account, returns JWT |
| `login(input)` | Mutation | Authenticate, returns JWT |
| `me` | Query | Current user profile |
| `companies` | Query | List all companies |
| `company(id)` | Query | Single company |
| `createCompany(input)` | Mutation | Add a company |
| `deleteCompany(id)` | Mutation | Remove company + cascade |
| `reports(companyId, year?)` | Query | Emission reports (filterable by year) |
| `createReport(input)` | Mutation | Log an emission report |
| `deleteReport(id)` | Mutation | Remove a report |
| `goals(companyId)` | Query | Reduction goals |
| `createGoal(input)` | Mutation | Add a goal |
| `deleteGoal(id)` | Mutation | Remove a goal |

### REST

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/analytics/summary` | Aggregated stats across all companies |
| `GET` | `/api/reports/:companyId/export` | Download reports as CSV |
| `POST` | `/api/reports/:companyId/import` | Bulk-import reports from CSV |

---

## Database Schema

```
User ──── Company ──── EmissionReport
                  └─── ReductionGoal
```

- **User** — `id`, `email`, `password`, `name`, `role (ADMIN|USER)`, `companyId?`
- **Company** — `id`, `name`, `industry?`, `country?`
- **EmissionReport** — `year`, `quarter?`, `co2Emissions?`, `energyUsage?`, `waterUsage?`, `wasteGenerated?`, `renewablePct?`, `notes?`
- **ReductionGoal** — `metric (CO2|ENERGY|WATER|WASTE)`, `baselineYear`, `baselineValue`, `targetYear`, `targetValue`

Cascade deletes ensure that removing a company cleans up all its reports and goals.

---

## CI / CD

GitHub Actions runs on every push and pull request to `master`:

```
server job               client job
─────────────────────    ─────────────────────
npm ci                   npm ci
prisma generate          lint
lint                     tsc --noEmit
tsc --noEmit             next build
nest build
```

Both jobs must pass before a merge is allowed.

---

## Project Highlights

- **Zero `any`** — strict TypeScript with `@typescript-eslint` rules enforced in CI; shared `JwtPayload` / `GqlContext` interfaces eliminate type duplication across guards, decorators and resolvers.
- **Server Components first** — auth-gated pages are rendered entirely on the server; client components are the minimal interactive islands, keeping the JS bundle small.
- **Optimistic UI** — report and goal mutations update local state immediately via custom hooks (`useReports`, `useGoals`) and call `router.refresh()` in the background to re-sync server data without full page reloads.
- **Single responsibility** — no file exceeds ~100 lines; each component, hook, service and resolver has exactly one concern.
- **Prisma cascade deletes** — referential integrity enforced at the database level, not in application code.
