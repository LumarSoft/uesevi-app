# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

```bash
pnpm dev      # next dev — http://localhost:3000
pnpm build    # next build
pnpm lint     # next lint (eslint-config-next)
pnpm start    # next start
```

There is no test suite and no test runner configured.

Production runs through a custom Node server under PM2, not `next start`:
`server.js` (custom `createServer` wrapper, hostname `uesevi.org.ar` in production) launched by
`ecosystem.config.cjs` (`pm2 start ecosystem.config.cjs --env production`).

## Environment

Single variable: `NEXT_PUBLIC_BASE_API_URL` — the base URL of the external REST API
(the production value is hardcoded in `ecosystem.config.cjs`). Read it through
`src/shared/providers/envProvider.ts` or `src/services/mysql/functions.ts`.

## What this app is

Front end for **UESEVI**, an Argentine security-guard union. It is a Next.js 14 App Router
client for a separate REST backend (no Next API routes, no database access from this repo —
`src/services/mysql/` is only an HTTP client despite the name). Everything is in Spanish:
code identifiers, comments, UI copy. Keep it that way.

Three audiences, three route trees:

| Tree | Users | Auth role |
|---|---|---|
| `src/app/(navbar)/` | public site (noticias, escalas, contacto, afiliaciones, alta-empresa) | none |
| `src/app/empresa/(sidebar)/` | member companies uploading DDJJ | `empresa` |
| `src/app/admin/(sidebar)/` | union staff | `admin` |

## Architecture

### Pages are thin; modules hold the work

`src/app/**/page.tsx` files are almost always `"use client"` shells that fetch with
`fetchData` in a `useEffect` and render a component from `src/modules/`. All real UI,
state and business logic lives under `src/modules/<Area>/<Feature>/`, each with
`index.tsx` plus local `components/`, `Table/Columns.tsx` + `Data-Table.tsx`
(TanStack Table), `Dialogs/`, and `helpers.ts`. Add a feature by creating a module
directory and a thin page that mounts it, plus an entry in
`src/shared/constants/side-nav-admin.ts` or `side-nav-company.ts`.

`src/shared/` holds cross-cutting code (types, stores, hooks, utils, Navbar/Sidebar/Header
components); `src/components/ui/` is shadcn/ui (see `components.json`, alias `@/components`,
base color zinc); `@/*` maps to `./src/*`.

### Data access

Every request goes through the five functions in `src/services/mysql/functions.ts`
(`fetchData`, `fetchOneRow`, `postData`, `updateData`, `deleteData`). They:

- prefix `NEXT_PUBLIC_BASE_API_URL`, attach `Authorization: Bearer <token>` from the Zustand store,
- substitute `:id` in endpoint strings (`fetchOneRow("companies/:id", 3)`),
- send **`FormData`** for POST/PUT (never JSON — do not set `Content-Type` yourself),
- normalize failures into `{ ok: false, status, statusCode, message, errors, data: null }`
  instead of throwing, so callers must check `result.ok`,
- on HTTP 401 log out and hard-redirect to `/admin/login` or `/loginempresa`.

`errors` carries the backend's row-by-row Excel validation detail; it is rendered by
`src/shared/components/StatementErrorsPanel.tsx`.

`@tanstack/react-query` and `zod` are installed but unused (`src/services/zod/zod.ts` is empty) —
data fetching is hand-rolled `useEffect` + `useState`. Follow the existing pattern rather
than introducing react-query for one screen.

### Auth

JWT only, no NextAuth session and **no middleware.ts**. `userStore`
(`src/shared/stores/userStore.ts`, Zustand + `persist` under key `auth-storage`) is the single
source of truth for the token — never read or write `localStorage` for auth directly.
`src/shared/utils/tokenUtils.ts` decodes the JWT client-side (`decodeJWT`, `isTokenExpired`,
`isAuthenticatedWithRole`). The role check runs in a `useEffect` inside the two `(sidebar)`
layouts and redirects; this is **UX only** — the real enforcement is the backend validating
the bearer token on every request.

## Domain rules that are easy to get wrong

**Declaración jurada (DDJJ)**: a company uploads a monthly Excel of employees; the system
computes union contributions. The upload/validation flow is
`src/modules/company/empleados/importacion/` with the column contract in
`constants/excelSchema.ts` (`REQUIRED_COLUMNS`, header keys are accent-stripped and
snake_cased: `categora`, `sueldo_bsico`). `src/shared/utils/validateStatementRows.ts` mirrors
the backend's `employeeImportValidation.js` so companies see per-row errors before uploading —
if backend validation changes, change both.

**Contributions**: aporte sindical 3% (affiliated only), FAS 1%, aporte solidario 2%
(non-affiliated only). Read the long comment block at the top of
`src/shared/utils/aportes.ts` before touching any contribution math. The solidario formula
is **versioned by the DDJJ's load date** (`declaraciones_juradas.fecha`), not by its period:
use `calcularAporteSolidarioPorPeriodo` for displaying existing declarations (table, totals,
PDF, admin and company alike) and `calcularAporteSolidario` for new uploads and
rectificaciones. Collapsing the two branches silently corrupts historical amounts. The
`presentismo` and `sueldo_basico` used are the **category** values frozen on the `sueldos`
row, not the salary the company declared.

**Antiguas / old-***: `src/modules/Admin/Antiguas/` and the `old-companies` / `old-statements`
/ `old-contracts` endpoints are a parallel legacy dataset with its own types
(`IOld*.ts`). Do not merge them with the current declaraciones code paths.

**Panel de Pagos** (`src/modules/Admin/PanelPagos/`): the summary cards toggle between
`mode=periodo` (accrual) and `mode=caja` (by actual payment date); the grid is deliberately
always by period. Month selects are labeled "mes (mes vencido)" via `mesConVencido`.

## Conventions

- Commit messages: Conventional Commits with Spanish (occasionally English) subjects; feature
  branches merged to `main` via PRs from `LumarSoft/<slug>`.
- Currency/date formatting is `es-AR` / ARS (`formatCurrency` in module `helpers.ts`).
- Toasts use `react-toastify` (`ToastContainer` mounted in the root layout).
- PDFs: `@react-pdf/renderer` in `PDFGenerator.tsx` / `PDFDownloadButton.tsx`;
  Excel read/write: `xlsx` and `exceljs`.
- `next.config.mjs` sets `images.unoptimized: true` and allows remote images from `uesevi.org.ar`.
