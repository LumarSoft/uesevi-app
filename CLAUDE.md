# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # dev server on :3000
pnpm build            # next build
pnpm start            # next start (see deploy note below)
pnpm lint             # next lint (eslint-config-next)
pnpm exec tsc --noEmit  # typecheck — the only "test" available
```

There is no test suite and no test runner configured. Verification = typecheck + lint + running the app.

Production runs through PM2 (`ecosystem.config.cjs`) against the custom `server.js`, not `next start`. `server.js` hardcodes hostname `uesevi.org.ar` when `NODE_ENV=production`.

`NEXT_PUBLIC_BASE_API_URL` (in `.env`) points at the external API. Nothing else is configured by env.

## Architecture

**Frontend-only Next.js 14 App Router app.** There are no API routes, no server actions, no DB access from this repo. Every page is `"use client"`; the App Router is used purely for routing and layouts. All data comes from a separate Express/MySQL API (`LumarSoft` backend) over `NEXT_PUBLIC_BASE_API_URL`.

### Page → module pattern

`src/app/**/page.tsx` files are thin client wrappers: they `fetchData(...)` in a `useEffect`, hold `loading`/`error` state, render `<Loader />`, and pass the payload as props into a module from `src/modules/`. All real UI and logic lives in `src/modules/<Area>/<Feature>/index.tsx` with a local `components/` folder, conventionally `components/Table/{Data-Table.tsx,columns.tsx}` (TanStack Table) and `components/Dialog[s]/`. Follow this split when adding a screen — do not put logic in `page.tsx`.

Areas map to route groups:
- `src/app/(navbar)/*` → `src/modules/Client/*` — public site (noticias, afiliaciones, escalas, contacto, company login).
- `src/app/admin/(sidebar)/*` → `src/modules/Admin/*` — union staff back office.
- `src/app/empresa/(sidebar)/*` → `src/modules/company/*` — employer portal.
- `src/modules/Login` is the admin login card; `src/modules/Client/loginEmpresa` is the company one.

### API layer

`src/services/mysql/functions.ts` is the single HTTP layer — `fetchData`, `fetchOneRow`, `postData`, `updateData`, `deleteData`. Do not call `fetch`/`axios` directly elsewhere.

- Endpoints are passed **without** a leading slash (`fetchData("statements")`); `fetchOneRow`/`updateData`/`deleteData` substitute `:id` in the path.
- **Writes always take `FormData`**, never JSON — `postData`/`updateData` deliberately omit `Content-Type` so the browser sets the multipart boundary.
- Everything returns the same envelope: `{ ok, status, statusCode, message, errors, data }`. `errors` carries the backend's row-by-row Excel validation detail. Failures resolve (they do not throw), so check `result.ok` rather than wrapping in try/catch alone.
- A `401` from any call logs the user out and hard-redirects to `/admin/login` or `/loginempresa` based on the current path.

### Auth

JWT-only, no next-auth session (the `next-auth` import in `shared/components/Header/UserNav.tsx` is vestigial; `jose`, `jsonwebtoken`, `cookies-next` are unused deps — do not treat them as the auth mechanism).

`src/shared/stores/userStore.ts` (zustand + `persist`, key `auth-storage`) is the **single source of truth for the token** — never read or write `localStorage` for auth outside it. `src/shared/utils/tokenUtils.ts` decodes the JWT client-side (`decodeJWT`, `isTokenExpired`, `getValidToken`, `isAuthenticatedWithRole`, `clearAuthToken`).

Route protection is a `useEffect` in `app/admin/(sidebar)/layout.tsx` and `app/empresa/(sidebar)/layout.tsx` checking `isAuthenticatedWithRole("admin" | "empresa")`. **This is UX only** — the real check is the backend validating the `Authorization: Bearer` header that `authHeaders()` attaches. Login posts `FormData` with `email`/`password`/`rol` to `login` and calls `userStore.getState().setAuth(token, user)`.

`src/shared/context/userStore.ts` is an empty leftover; use `src/shared/stores/userStore.ts`.

## Domain

The app manages *declaraciones juradas* (monthly sworn payroll statements) that employers file and the union reviews, plus the resulting contributions and payments.

Three contributions per employee: **aporte sindical** 3% (union members), **FAS** 1%, and **aporte solidario** 2% (non-members only).

### ⚠️ `src/shared/utils/aportes.ts`

Read the comment block in this file before touching anything that displays contribution amounts. The aporte solidario formula changed on 2026-07-01 and is versioned by **when the declaration was loaded** (`declaraciones_juradas.fecha`), not by the period it covers — late filings and rectifications break any period-based assumption. Use `calcularAporteSolidarioPorPeriodo` for existing declarations (tables, totals, PDFs, admin and company alike) and `calcularAporteSolidario` only on the load/rectify screens, which always create a new declaration under the current formula. Collapsing the two branches will make old declarations display per-employee amounts that no longer sum to the declared total.

Related: `sueldos.sueldo_basico` holds the **category's** basic salary, `sueldos.monto` holds the employee's declared salary; `sueldos.presentismo` is a snapshot frozen at load time — never read the live value from `categorias` for historical views.

### Excel import

Employers upload declarations as `.xlsx` (`modules/company/empleados/importacion`, and the same shape under `declaraciones/.../rectificar`). Parsing is `xlsx` in the browser; `shared/utils/plantillaEmpleados.ts` builds the downloadable template with `exceljs` (data validation dropdowns for categories).

`shared/utils/validateStatementRows.ts` mirrors the backend's `employeeImportValidation.js` so employers see row-numbered errors before upload; `StatementErrorsPanel` renders them. If backend validation rules change, this file must change with them.

`modules/company/empleados/importacion/constants/excelSchema.ts` holds `REQUIRED_COLUMNS` — the keys are the accent-stripped forms the parser produces (`categora`, `sueldo_bsico`), so leave them mangled. Bumping `EXCEL_SCHEMA_VERSION` re-triggers the "template changed" notice for every user via localStorage.

### Legacy data

`antiguas` / `old-companies` / `old-statements` / `old-contracts` and the `IOld*` types are read-only records imported from the union's previous system. They live in parallel screens under `admin/(sidebar)/antiguas` and are never written to.

### Panel de pagos

`modules/Admin/PanelPagos` has a `PanelMode` toggle: `periodo` (accrual, by declaration period) vs `caja` (cash, by actual payment date). The toggle currently governs only the summary cards — the grid stays on `periodo` by design, even though the backend supports `?mode=caja` for it.

## Conventions

- **Spanish** for UI text, comments, domain vocabulary, and module/folder names (`Declaraciones`, `Empresas`, `Escalas`); **English** for API endpoints (`statements`, `companies`, `scales`) and generic helpers. Match whichever the surrounding file uses.
- shadcn/ui in `src/components/ui` (zinc base, CSS variables) — regenerate with the shadcn CLI rather than hand-writing new primitives. App-wide shared components live in `src/shared/components`.
- Import via the `@/*` alias (`@/modules/...`, `@/shared/...`, `@/components/ui/...`).
- Types for API payloads go in `src/shared/types/Querys/I<Name>.ts`.
- Toasts: `react-toastify` (the `<ToastContainer />` is in the root layout); `next-themes` `ThemeProvider` wraps only the two sidebar layouts.
- PDFs use `@react-pdf/renderer` (`PDFGenerator.tsx` / `PDFDownloadButton.tsx` next to the screen that needs them).
- `next.config.mjs` sets `images.unoptimized: true` — remote images come from `uesevi.org.ar`.
