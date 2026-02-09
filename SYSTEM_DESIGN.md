# PlannerOS – System Design

## 1. Overview

**PlannerOS** is a B2B SaaS platform providing an all-in-one operating system for event planners. Its architecture emphasizes security, modularity, scalability, and maintainability, leveraging proven cloud-native and modern web technologies.

---

## 2. High-Level Architecture Diagram

```text
+---------------------------+
|      CLIENT LAYER         |
|---------------------------|
| - Next.js/React SPA       |
| - Portals:                |
|   - Admin                 |
|   - Planner               |
|   - Vendor                |
|   - Client (Intake)       |
+------------+--------------+
             |
             v
+---------------------------+
|   APPLICATION LAYER       |  (Next.js App Router)
|---------------------------|
| - Routing & Rendering     |
| - Middleware/API Handlers |
| - App-State Providers     |
+------------+--------------+
             |
             v
+---------------------------+
|   SERVICE LAYER (lib/)    |
|---------------------------|
| - Domain Models/Types     |
| - Business Logic Services |
| - Data Access Repos/DAOs  |
| - Utilities/Config        |
+------------+--------------+
             |
             v
+---------------------------+
|      DATA LAYER           |
|---------------------------|
| - Supabase PostgreSQL     |
| - RLS (Multi-tenancy)     |
| - Auth/Storage/Realtime   |
+---------------------------+
```

---

## 3. Layer Details

### **A. Client Layer (Next.js Frontend)**
- Multi-portal frontend: **Planner**, **Vendor**, **Client Intake**, and **Admin** interfaces
- Responsive, mobile-first UI with shadcn/ui components and TailwindCSS
- Global state via React context providers (e.g., EventProvider, ClientIntakeProvider)
- All navigation and forms handled through the Next.js **App Router**

### **B. Application Layer**
- Route groups: `/app/(auth)`, `/app/(dashboard)`, `/app/admin`, `/app/vendor`
- API routes reside in `/app/api/v1/*`, segmenting traffic per resource
- Server actions handle form submissions, server-only logic, and REST endpoints

### **C. Service Layer (`lib/`)**
- **Domain models**: TypeScript interfaces and enums define event, vendor, booking, payment, etc.
- **Services**: Business rules/workflows (e.g., event creation, booking workflow, feasibility checks)
- **Repositories**: Data access objects abstract all database calls (Repository pattern)
- **Utils/Config**: Helper functions, Zod schema validations, environment handling

### **D. Data Layer (Supabase)**
- **PostgreSQL** with strict **Row Level Security (RLS)** per tenant/user/role
- Database organized with dedicated tables (events, vendors, bookings, clients, messages, etc.)
- **Supabase Auth** for role-based authentication (JWT/Session)
- **Storage** for assets (e.g. venue images, mood boards)
- **Realtime** channels for live event status and booking updates

---

## 4. Key Design Patterns

- **Repository Pattern:** All direct DB access via repository classes like `EventRepository`, `VendorRepository`, etc.
- **Service Pattern:** All business logic in service classes, not in components or controllers.
- **Provider Pattern:** React context providers for global business state (multi-tab navigation, intake forms, etc.).
- **Validation Layer:** All API/request payloads validated via Zod schemas.
- **DTO Enforcement:** TypeScript types and Zod schemas synced (DRY).

---

## 5. Data Flow

- **Query:**
  - UI → Custom React hook → Repository (service) → Supabase DB → Data
- **Mutation:**
  - UI → Server Action/API Route  → Service (validates, processes) → Repository → DB
- **API Response:** Unified pattern using types like `ApiResponse<Data>`, with clear success/error forms

---

## 6. Security & Multi-Tenancy

- **RLS** enforces per-user/event/vendor data isolation at the DB layer.
- **Supabase Auth** provides access tokens with role and user ID for every request.
- **Frontend gating** and **API/middleware** guards ensure access only by appropriate role/tenant in every action.

---

## 7. Deployment, CI/CD, Cost

- **Deployment**: Vercel (static hosting, Next.js serverless functions) + Supabase (DB/Auth/Storage)
- **CI/CD**: GitHub Actions for lint/typecheck/test, auto-deploy via Vercel
- **Cost**: All services run on generous free tiers for dev/testing

---

## 8. Extensibility

- New business features are implemented by:
  - Extending domain model (e.g., `BookingRequest`)
  - Adding new repo/service logic
  - Exposing via new API route or server action
  - Surfacing in UI with typed provider/context
- Already ready for mobile/PWA extension, cross-platform API use

---

## 9. Documentation References

- [`ARCHITECTURE.md`](https://github.com/vaishk984/planner-os/blob/main/ARCHITECTURE.md)
- [`docs/PROJECT_CONTEXT.md`](https://github.com/vaishk984/planner-os/blob/main/docs/PROJECT_CONTEXT.md)
- [`docs/implementation_plan.md`](https://github.com/vaishk984/planner-os/blob/main/docs/implementation_plan.md)

---

## 10. Diagram Example

```text
 Client (Planner/Vendor/Admin)
          |
  +-------+------------+
  | Next.js Frontend   |
  +---+------------+---+
      |            |
      v            v
 [API Route]   [Server Action]
      |            |
      +-----+------+
            v
         [Service Layer]
            v
        [Repository]
            v
         [Supabase DB]
```

---

_Last updated: February 2026_
