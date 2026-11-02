# Full Stack Engineering Interview Lab

Authentication is implemented with email/password signup, secure database sessions, account-scoped progress, and deliberate anonymous-history import. See [Authentication setup and migration guide](docs/AUTHENTICATION.md) before configuring or deploying this application. After `npm ci`, run `npm run db:generate`; set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and the existing `DATABASE_URL` before production use.

The application now runs on Next.js 16.4.3 with Turbopack for development and production builds. See [the upgrade and recovery notes](docs/NEXTJS_UPGRADE.md) for compatibility changes and the explicit Webpack fallback commands.

An interactive engineering simulation platform designed for developers with 2–10 years of experience preparing for senior full-stack, staff engineer, and technical leadership interviews.

Unlike static flashcard or question bank sites, this is an **interactive engineering simulation platform** featuring realistic production incidents, code reviews, deep event-loop and memory debugging, system design architecture diagrams, senior hiring committee rubric evaluations, and a dedicated **in-browser coding practice environment**.

---

## 🚀 Key Architectural Features

### 1. In-Browser Coding Practice Environment (`/practice`)
- **Integrated Monaco Editor**: Professional code editor with syntax highlighting, automatic indentation, line numbers, and minimap. Operates completely inside the web browser and is strictly decoupled from any IDE or terminal.
- **Initial Supported Languages**:
  - **JavaScript**: Executed in a client-side isolated sandbox with console log capture, restricted global scope, and 1,500ms timeout guards.
  - **TypeScript**: Processed with a client-side syntax and type stripper (removes interfaces, type aliases, generic type parameters, and type annotations) allowing immediate client-side test execution without server-side compile latency.
  - **SQL**: In-memory relational database engine powered by AlaSQL. Sets up independent schema DDL and seed tables per test case, executes complex queries (CTEs, window functions, partitions, aggregations), and formats tabular query results.
- **Dual-Action Evaluation Workflow**:
  - **Run Code (Samples)**: Fast iteration against sample test cases with real-time console log and return-value inspection.
  - **Submit Answer (Full Suite)**: Runs the candidate's code against the full suite (including edge cases and hidden tests), computing percentage score and execution duration.
- **Progressive Hints & Staff Solutions**:
  - Tiered hints revealed sequentially without spoiling the problem.
  - Detailed reference solutions featuring complexity analysis ($O(N)$ time and space benchmarks) and architectural trade-off explanations.

### 2. Strict Security & Sandbox Execution Boundaries
- **Zero Arbitrary Server Execution**: User-submitted code is **never** executed directly on the Next.js application server. This protects infrastructure from server-side request forgery (SSRF), resource starvation, and process escape vulnerabilities.
- **Unconfigured Language Guard**: When languages that require containerized virtualization (e.g., Python, Go, Rust) are selected, the platform clearly displays an **Execution Service Not Configured** notice explaining why arbitrary server execution is barred and provides candidate tasks, sample inputs, expected outputs, progressive hints, and a reference solution for self-assessment.

### 3. Five Realistic Simulation Modes
- **Debugging Challenges**: Inspect realistic buggy code (event-loop microtask starvation, closure memory leaks, stale React closures, N+1 query loops, connection pool collapses). Edit the code, run sandboxed tests safely in the browser, review failures, and submit root-cause explanations.
- **Production Incidents**: Investigate live outages with simulated telemetry: system logs, Prometheus/APM metrics, customer impact reports, and recent git commit diffs. Candidates formulate root-cause hypotheses, cite telemetry evidence, prescribe immediate mitigation, design permanent corrections, write regression tests, and configure PromQL alerting rules.
- **Coding Challenges**: Solve complex concurrency, typing, and architectural coding problems (generic route parsers, discriminated union event routing, async mutex locks, full-jitter retry algorithms, monotonic event versioning) with Monaco Editor and client-side test execution.
- **Code Review Pull Requests**: Review realistic Pull Requests (multi-vendor payout split, Redis session revocation) to catch IDOR authorization bypasses, IEEE 754 floating-point financial bugs, unhandled promise rejections, and blocking `KEYS *` commands.
- **System Design Architecture Canvas**: Interactive drag-and-drop architecture canvas (Clients, CDNs, Load Balancers, API Gateways, Microservices, Redis Caches, PostgreSQL, Columnar OLAP, Kafka / SQS Queues, Workers). Define API contracts, data models, sharding strategies, and failure modes.
- **Senior & Staff Interview Dialogue**: Multi-stage architectural and leadership interviews with dynamic follow-ups, expected competency tags, and exemplary answer benchmarks.

### 4. Rich Scenario Library (50 Complete Scenarios)
Zero placeholder content. Real-world business contexts across:
- **JavaScript**: Event loop microtask starvation, SSE connection closure memory leaks, multi-tab wallet race conditions, unhandled promise crash loops, V8 GC object allocation latency.
- **TypeScript**: Multi-gateway webhook discriminated unions with compile-time exhaustiveness (`assertNever`), generic RPC route param inferrers, multi-tenant RBAC type narrowing, deep immutable state containers.
- **React**: Order-book live ticker stale closures, 10,000-row inventory table cascading re-renders & virtualization, debounced autocomplete out-of-order race conditions with `AbortController`, WCAG 2.1 AA accessible comboboxes, optimistic UI mutation hooks with rollback.
- **Next.js**: Server/client component private key leaks, multi-timezone SSR hydration mismatches, high-traffic ISR cache stampedes (dog-piling), Edge middleware infinite redirect loops, streaming Suspense with localized error boundaries.
- **Node.js**: CPU-intensive password hashing freezing event loops (libuv threadpool tuning), Express async error middleware swallowing rejections, distributed Redis sliding-window rate limiters, multi-gigabyte CSV stream backpressure, Kubernetes rolling restart graceful shutdown.
- **Databases (PostgreSQL)**: Cart reservation row deadlocks (`SELECT FOR UPDATE` deterministic sorting), N+1 query optimization with composite indexes, financial ledger write-skew under `READ COMMITTED` vs `SERIALIZABLE`, million-row keyset (cursor) pagination, zero-downtime 50M-row expand/contract column migrations.
- **Integrations**: Stripe webhook replay idempotency keys and signature validation, multi-provider WhatsApp/SMS circuit breaker fallbacks, bi-directional CRM out-of-order event synchronization, exponential backoff with full jitter.
- **Engineering Operations**: Node.js container memory leak post-mortem, AWS IAM / Stripe key leak triage & OIDC migration, canary release automated rollback analysis, OpenTelemetry distributed trace waterfall bottleneck resolution.
- **System Design**: 50M notifications/day multi-channel notification engine, idempotent high-volume checkout service with transactional outbox, real-time multi-tenant CRM columnar analytics engine (ClickHouse), distributed cron & delayed job scheduler (Redis Sorted Sets).
- **Security & Leadership**: Custom webhook AWS metadata SSRF (IMDSv2 & DNS rebinding), 45-minute outage blameless post-mortem facilitation, legacy monolith strangler fig modernization.

### 5. Transparent Rubric-Based Evaluation Engine
- Scores across 7 critical engineering dimensions: Root-Cause Reasoning, Correctness, Code Quality, Security, Reliability, Testing, and Trade-off Analysis.
- Explicit non-guaranteed prediction disclaimer: Practice benchmarks provide structured skill growth without making misleading guarantees regarding live company hiring decisions.
- Reference solutions remain strictly hidden until submitted or explicitly revealed.

### 6. Decoupled Persistence Layer
- **LocalStorageAdapter**: Fully functional local MVP with automatic streak tracking, attempt history, bookmarks, and full JSON export/import.
- **PrismaStorageAdapter & PostgreSQL Schema**: Ready in `prisma/schema.prisma` (`User`, `ScenarioAttempt`, `Bookmark`, `UserNote`) for seamless server database drop-in without rewriting challenge or evaluation logic.

### 7. Conversational AI Interviewer (Google Gemini Developer API)
- **Official `@google/genai` Integration**: Communicates with Google's latest `gemini-2.0-flash` model via the official `@google/genai` JavaScript SDK.
- **Full Server-Side Isolation**: Next.js App Router API Route Handler (`src/app/api/ai-interview/route.ts`) acts as a secure proxy. The API key is never bundled in client code or returned in network payloads.
- **Dynamic Multi-Turn Dialogue**:
  - Generates tailored architectural and coding questions based on candidate role (Full Stack, Senior Frontend, Senior Backend, Tech Lead / Staff), topic, and difficulty.
  - Accepts candidate answers in plain text or code, evaluating technical correctness, depth of reasoning, trade-off awareness, and production readiness.
  - Generates contextual, probing follow-up questions tailored directly to the candidate's actual answer (e.g., addressing unhandled race conditions or scaling bottlenecks).
  - Progressive hint system: Delivers nudges on request without disclosing full reference implementations.
  - Final Hiring Committee Evaluation: Comprehensive breakdown containing verified strengths, growth areas, dimensional scores (Architecture, Problem Solving, Production Readiness, Communication), and an overall hiring recommendation.
- **Reliable Offline & Quota Simulation Engine**:
  - When `GEMINI_API_KEY` is not supplied or if Gemini's rate limits/quotas are reached, the platform automatically engages `src/lib/gemini/offlineFallback.ts`.
  - Simulates authentic multi-turn technical interviews across all engineering roles with evaluative turn feedback and scorecard generation, ensuring 100% test and offline availability.
- **Resilient Session State**:
  - The current live interview session is persisted locally under `fullstack_ai_interview_session_v1` in `localStorage`. Page refreshes or accidental navigation will not erase the in-flight conversation.
  - Completed AI evaluations can be archived directly into the candidate's historical progress record.
- **Cost & Abuse Controls**:
  - In-memory sliding-window rate limiting (max 30 requests/minute per client IP).
  - Strict input size validation (max 10,000 characters per answer/config).
  - Turn bounding (up to 5 follow-up turns per question) and 25-second server timeout guards to avoid hanging connections.

### 8. Enterprise Loan Management Dashboard (`/challenges/loan-management`)
- **Realistic NBFC Underwriting Suite**: An interactive enterprise application for loan officers managing thousands of high-volume loan applications across diverse risk tiers.
- **Redux Toolkit Architecture**:
  - `applicationsSlice`: Manages server-side entity state, pagination, multi-attribute filtering (search, status, loan type, risk rating), column sorting, and monotonic request-ID concurrency tokens.
  - `dashboardSlice`: Aggregates real-time portfolio KPI metrics (Total Volume, Pending Facilities, Funded Loans, Approval Rates, and Average Credit Scores).
  - `uiSlice`: Manages slide-over drawer visibility, confirmation modals, non-intrusive floating toasts, and production simulation parameters.
- **Dual-Layer Concurrency & Race-Condition Defense**:
  - In-flight request cancellation via Redux Toolkit `thunkAPI.signal` passed directly to `fetch`.
  - Monotonic request-token guards (`latestRequestId`): Stale out-of-order search responses resolving during network jitter are discarded before mutating state.
- **Atomic Optimistic Updates with Rollback**:
  - On status update dispatch, the UI transitions immediately while capturing pre-mutation snapshots in `optimisticBackups[id]`.
  - Row locking (`updatingIds[id] = true`) prevents duplicate submissions during in-flight network transit.
  - Upon network rejection or policy failure (HTTP 409/422), state is atomically rolled back to the original snapshot and a detailed error toast is displayed.
- **Performance Optimizations**:
  - `createSelector` memoized selectors compute pagination bounds, active filter tallies, and status distributions without duplicating state.
  - `React.memo` wrapped `LoanTableRow` components with `useCallback` stable handlers shield rows from parent keystroke re-renders.
  - 300ms debounced search input decouples typing latency from Redux dispatches.
- **8 Interactive Production Bug Scenarios**:
  - **Bug 1: Race Condition** (Rapid search typing overwrites newer results; solved via monotonic request tokens).
  - **Bug 2: Duplicate API Calls** (Unmemoized object dependencies trigger repeated fetches; solved via stable primitives & condition guards).
  - **Bug 3: Optimistic Update Failure** (Rejection leaves broken approvals on screen; solved via backup snapshots and atomic rollback).
  - **Bug 4: Incorrect Pagination** (Narrowing filters leaves page out-of-bounds; solved via explicit page resets).
  - **Bug 5: Redux State Mutation** (Accidental in-place array mutation; solved via immutable clones).
  - **Bug 6: Excessive Re-renders** (Typing causes full table re-render; solved via debouncing and React.memo).
  - **Bug 7: Stale Closure** (Callbacks enclosing outdated filter state; solved via dynamic `getState()` reads).
  - **Bug 8: Failed Request Recovery** (Network drop causes infinite loading wheel; solved via rejected state transitions and retry actions).
- **Senior & Staff Interview Oral Defense Mode**:
  - 8-question structured interview progression evaluating candidates across the 7 weighted categories (Redux Architecture 20%, API 20%, React Design 15%, Concurrency 15%, Performance 10%, Testing 10%, Code Quality 10%).

### 9. Beginner / Tier 1 Interview Track & 4-Tier Preparation System (`/interview?tier=tier-1`)
- **Four Distinct Interview Preparation Tiers**:
  - **Tier 1: Beginner**: 0–2 Years Experience (Junior & Associate Full-Stack Engineers). Master core fundamentals with 63 original questions, progressive hints, code exercises, and instant supportive evaluation.
  - **Tier 2: Intermediate**: 2–5 Years Experience (Mid-Level Engineers). Deep component lifecycles, state synchronization, REST & GraphQL integration, and PostgreSQL query planning.
  - **Tier 3: Advanced**: 5–8 Years Experience (Senior Engineers). High-throughput queue architectures, SSR hydration boundaries, deadlock avoidance, and distributed caching.
  - **Tier 4: Senior / Production-Level**: 8+ Years Experience (Staff & Principal Architects, Lead SREs). The existing 50 production incidents, system design canvases, and enterprise loan management challenges.
- **63 Original Tier 1 Questions Across 6 Foundational Categories**:
  - **JavaScript Fundamentals (12 Questions)**: `var`, `let`, `const`, scope & TDZ, primitive vs reference types, `==` vs `===`, conditionals & switch fall-through, `for`, `while`, `for...of` loops, arrow functions vs regular `this`, array methods (`map`, `filter`, `find`), object destructuring & dynamic property keys, closures in plain terms, hoisting, Promises & `async/await`, and the event loop call stack vs task queue.
  - **HTML and CSS (10 Questions)**: Semantic tags & accessibility, form inputs paired with labels, CSS selector specificity hierarchy, CSS Box Model & `box-sizing: border-box`, Flexbox container & alignment axes, CSS Grid 2D templates, responsive design with mobile-first media queries, CSS units (`px`, `rem`, `em`, `%`), CSS position values (`static`, `relative`, `absolute`, `fixed`, `sticky`), and modern element centering.
  - **React Fundamentals (11 Questions)**: Declarative UI & Virtual DOM benefits, functional components & JSX syntax rules, props vs internal state, event handling & synthetic events, conditional rendering techniques, rendering lists with unique keys, `useState` & functional updater patterns, `useEffect` dependencies & cleanup handlers, controlled components, parent-child communication & lifting state up, and functional lifecycle phases.
  - **Redux Toolkit Fundamentals (10 Questions)**: Why state management is needed & avoiding prop drilling, local component state vs global store, Store, Actions, and Reducers, `createSlice` auto-generation, Immer direct-mutation draft state, `useSelector` subscriptions & `useDispatch`, async request lifecycles with `createAsyncThunk`, `configureStore` and Redux DevTools, when Redux is useful vs unnecessary, and action payloads.
  - **TypeScript Fundamentals (10 Questions)**: Why TypeScript exists & compile-time error detection, primitive types & type annotations, `interface` vs `type` aliases, typing arrays & objects, function parameter & return types (`void`), optional properties (`?`) & optional chaining (`?.`), union types & `typeof` narrowing guards, `any` vs `unknown` type safety, literal types for discrete states, and basic generics (`<T>`).
  - **Node.js and API Fundamentals (10 Questions)**: What Node.js is & browser JS differences (no DOM, OS/fs access), non-blocking event-driven I/O in plain terms, REST API core principles & statelessness, HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) & idempotency, HTTP status codes (`2xx`, `4xx`, `5xx`), Express server setup & route definitions, `req.params` vs `req.query` vs `req.body`, Express middleware & `next()`, environment variables & `.env` security, and Relational (SQL) vs Document (NoSQL) database concepts for beginners.
- **Two Distinct Beginner Preparation Modes**:
  - **Practice Mode**: Filter by category or search; view question statements and expected concept tags; write explanations or run interactive coding exercises; reveal progressive hints; inspect reference solutions with practical code examples; receive instant supportive feedback; retry questions anytime.
  - **Mock Interview Mode**: Sequentially answers 5, 10, or 15 questions under simulated interview pacing without viewing reference solutions; tracks elapsed time and scores each round immediately; generates a comprehensive final assessment report with readiness verdict, category performance breakdown, key strengths, and weak topics to revisit.
- **Dual-Engine Evaluation Architecture**:
  - **Gemini Live Evaluation**: Contextual evaluation and friendly follow-ups via `@google/genai` when configured.
  - **Tier 1 Conceptual Benchmark Rubric**: Instant heuristic evaluation matching concept stems, explanation depth, and code exercises with transparent attribution (`evaluatorType: 'rubric-benchmark'`).
- **Isolated & Backward-Compatible Persistence**:
  - Tier 1 attempts and bookmarks are stored under `fullstack_interview_lab_tier1_v1` without colliding with or altering existing senior challenge progress.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16.4.3 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **State Management**: Redux Toolkit 2.x (`@reduxjs/toolkit`) & React Redux 9.x (`react-redux`)
- **AI / LLM Integration**: Official Google Gen AI JavaScript SDK (`@google/genai` 2.x) with `gemini-2.0-flash`
- **Code Editor**: Monaco Editor (`@monaco-editor/react` 4.7)
- **In-Memory SQL Engine**: AlaSQL (relational client-side execution)
- **Icons**: Lucide React
- **Database / ORM**: Prisma 6 & PostgreSQL schema
- **Unit Testing**: Vitest 2.1 (104 tests across 11 suites)
- **E2E Testing**: Playwright (18 browser and integration tests)

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v20.9.0 or later for Next.js; v22.13+ or a newer supported LTS is recommended for the existing lint tooling.
- **npm**: v9 or later (comes bundled with Node.js)

### 1. Installation
Clone the repository and install dependencies:
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables (.env.local)

The application functions completely out of the box with zero external configuration using client-side `localStorage` persistence and the built-in offline interview simulation engine.

To enable live AI interviewing powered by Google Gemini:

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env.local` file in the root directory:
\`\`\`env
# Google Gemini Developer API Configuration (Server-Side Only)
GEMINI_API_KEY="your_gemini_api_key_here"

# Optional: Override the model (defaults to gemini-2.0-flash)
# GEMINI_MODEL="gemini-2.0-flash"

# Optional: PostgreSQL Connection (if using Prisma backend)
# DATABASE_URL="postgresql://postgres:password@localhost:5432/interview_lab?schema=public"
# NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

> [!IMPORTANT]
> **API Key Security**: `GEMINI_API_KEY` is loaded strictly server-side by Next.js Route Handlers (`src/app/api/ai-interview/route.ts`). It is never prefixed with `NEXT_PUBLIC_`, never bundled into client JavaScript, and never echoed back in API responses.

> [!NOTE]
> **Free Tier Quotas & Pricing**: `gemini-2.0-flash` is available on the Google AI Studio free tier (up to 15 RPM, 1,500 RPD, and 1M tokens/min). If your quota is exhausted or if no API key is configured, the application automatically switches to the built-in offline simulation engine without throwing unhandled exceptions.

To generate and push Prisma migrations when PostgreSQL is active:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 3. Run Local Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Main Dashboard**: `http://localhost:3000/`
- **Coding Practice Lab (Monaco)**: `http://localhost:3000/practice`
- **Scenario Catalog**: `http://localhost:3000/library`
- **Mock Interview Simulator**: `http://localhost:3000/interview`
- **Progress & Analytics**: `http://localhost:3000/progress`

### 4. Code Quality & Linting
Executes ESLint across all TypeScript components and Route Handlers:
\`\`\`bash
npm run lint
\`\`\`

### 5. Run Unit Tests (Vitest)
Executes unit tests for Gemini API payload validation, offline fallback simulation, rubric scoring, readiness calculation, safe sandboxing (JavaScript, TypeScript, and AlaSQL engines), and scenario consistency:
\`\`\`bash
npm test
\`\`\`

### 6. Run End-to-End Tests (Playwright)
Executes complete user journey verification across the dashboard, library filters, interactive workspace, mock interview generator, conversational AI interviewer, and Monaco coding practice lab:
\`\`\`bash
npm run test:e2e
\`\`\`

### 7. Build and Run in Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🧪 Conversational AI Interview Manual Testing Guide

Follow this step-by-step walkthrough to verify the conversational AI interviewer end-to-end:

### Step 1: Launch Application
Start the development or production server:
\`\`\`bash
npm run dev
\`\`\`
Navigate to [http://localhost:3000/interview](http://localhost:3000/interview) or click **AI Interview** in the navigation bar.

### Step 2: Configure Session Parameters
1. Choose a **Target Engineering Role** (e.g., *Senior Full-Stack Engineer* or *Staff / Tech Lead*).
2. Select a **Primary Technology Domain** (e.g., *Distributed Systems & Node.js*, *React & Frontend Architecture*, or *Databases & High-Throughput SQL*).
3. Select a **Target Difficulty** (*Intermediate (Mid-Level)*, *Advanced (Senior)*, or *Principal / Staff*).
4. Set **Estimated Duration** (e.g., *30 Minutes*).
5. Notice the **Engine Indicator** badge in the configuration card:
   - Green `Live Gemini API Connected` if `GEMINI_API_KEY` is present.
   - Yellow `Offline Simulation Engine` if no key is configured (allows full testing without credentials).
6. Click **Generate Original Question & Begin Session**.

### Step 3: Candidate Response & Evaluation
1. The AI interviewer outputs a customized question with an **Expected Competencies** checklist.
2. In the answer box, enter a technical explanation outlining architecture, trade-offs, and failure mitigation.
3. Click **Submit Answer & Request Feedback**.
4. The system analyzes the answer in real time, displaying:
   - Evaluative badge (*Strong*, *Partially Flawed*, *Needs Revision*).
   - Dimension scores across Technical Correctness, Depth of Reasoning, Trade-off Analysis, and Production Readiness.
   - Constructive critique and areas for improvement.
   - A contextual follow-up question specifically probing an edge case or scaling concern raised in your response.

### Step 4: Progressive Hint Request
1. Click **Request Architectural Hint**.
2. A progressive hint appears in the timeline giving conceptual direction without revealing the complete solution.

### Step 5: Session Persistence Verification
1. Refresh the browser page (`F5` or `Ctrl+R`).
2. Verify that the interview session, past turns, question history, and timer remain intact without loss of context (persisted in `localStorage` under `fullstack_ai_interview_session_v1`).

### Step 6: Complete Session & Hiring Committee Scorecard
1. Click **Conclude & View Final Evaluation**.
2. Confirm the **Hiring Committee Evaluation Scorecard** is displayed:
   - Overall Hiring Recommendation (*Strong Hire*, *Hire*, *Lean Hire*, *Lean No Hire*).
   - Numerical score benchmark (out of 100).
   - Dimensional breakdown (Architecture & System Design, Problem Solving & Algorithmic Rigor, Production Readiness & Reliability, Technical Communication).
   - Bulleted **Verified Strengths** and **Critical Areas for Growth**.
   - Clear attribution: `AI-Generated Evaluation (Google Gemini Developer API)`.
3. Click **Save to Historical Progress** to record the session into your permanent practice history.
