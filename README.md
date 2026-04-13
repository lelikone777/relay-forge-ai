# RelayForge AI

RelayForge AI is a production-style AI gateway playground built to feel like a real developer infrastructure SaaS product, not a chatbot demo. It combines a premium Next.js dashboard with a Cloudflare Worker API layer that handles provider routing, streaming, normalized error handling, and free-tier-safe fallback orchestration.

## Why this project exists

Most portfolio AI apps stop at a prompt box and a provider SDK. RelayForge AI is designed to demonstrate stronger engineering judgment:

- unified request/response contracts instead of provider-specific payloads
- streaming over a serverless edge runtime
- explicit fallback orchestration under free-tier limits
- normalized operational errors and observability-style dashboards
- a guaranteed public demo path through a mock provider

The result is a portfolio project that is credible in interviews, screenshot-ready, and deployable without paid hosting.

## Architecture summary

- `apps/web`: static Next.js App Router frontend deployed to Cloudflare Pages
- `apps/worker`: Cloudflare Worker API deployed independently as the AI gateway
- `packages/shared`: shared Zod schemas and TypeScript contracts

This split is intentional. The frontend stays static and cheap to host, while all secrets, provider calls, streaming transport, fallback logic, and telemetry remain on the server side in the Worker.

## Product surface

### Public pages

- Landing page
- Docs / API page

### App pages

- Playground
- Provider status
- Logs
- Usage analytics
- Settings

## Supported providers

- Groq Free: primary low-latency provider
- OpenRouter free models: fallback provider
- Mock / Demo provider: guaranteed public demo safety net

## Fallback behavior

`Auto` strategy follows this order:

1. Try Groq first
2. If Groq times out, is rate-limited, unavailable, or returns malformed upstream data, try OpenRouter
3. If OpenRouter also fails or is not configured, switch to the mock/demo provider

Every successful response includes metadata for:

- selected strategy
- attempted provider
- final provider
- fallback activation
- degraded mode
- demo mode
- latency
- model

## Normalized error model

RelayForge AI normalizes the following error codes:

- `validation_error`
- `provider_timeout`
- `provider_rate_limited`
- `provider_unavailable`
- `malformed_upstream_response`
- `stream_interrupted`
- `internal_error`
- `fallback_activated`

The UI never exposes raw stack traces. Errors stay readable for demo users and technically credible for engineers reviewing the project.

## Mock / demo mode

The mock provider is not a placeholder. It is a core reliability feature.

Its job is to guarantee that the public demo remains usable even when:

- free-tier quotas are exhausted
- provider keys are missing
- upstream services are temporarily unavailable
- you deliberately enable demo-only mode

Mock mode supports pseudo-streaming and returns realistic metadata so the product still feels coherent.

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Use `.env.example` as the source of truth.

- put `NEXT_PUBLIC_API_BASE_URL` into `apps/web/.env.local`
- put worker variables into `apps/worker/.dev.vars` for local `wrangler dev`
- in production, store provider secrets with Wrangler secrets

### 3. Run the frontend

```bash
npm run dev:web
```

### 4. Run the Worker

```bash
npm run dev:worker
```

The default local frontend expects the Worker at `http://127.0.0.1:8787`.

## Build commands

```bash
npm run typecheck
npm run build
```

## Cloudflare deployment

### Frontend: Cloudflare Pages

Deploy `apps/web` as a static Next.js export.

- build command: `npm run build --workspace @relayforge/web`
- output directory: `apps/web/out`
- environment variable: `NEXT_PUBLIC_API_BASE_URL=https://your-worker-name.your-subdomain.workers.dev`

### Backend: Cloudflare Workers

Deploy `apps/worker` with Wrangler.

```bash
cd apps/worker
wrangler secret put GROQ_API_KEY
wrangler secret put OPENROUTER_API_KEY
wrangler deploy
```

Recommended Worker vars:

- `ALLOWED_ORIGIN`
- `GROQ_MODEL`
- `OPENROUTER_MODEL`
- `OPENROUTER_HTTP_REFERER`
- `OPENROUTER_APP_TITLE`
- `RELAYFORGE_FORCE_DEMO`

## GitHub auto-deploy (no manual CLI deploy)

The repo includes a production workflow at [deploy.yml](/C:/Users/lelik/WebstormProjects/relay-forge-ai/.github/workflows/deploy.yml).

On every push to `main`, GitHub Actions will:

1. install dependencies and run type checks
2. build the static frontend
3. deploy the Worker
4. deploy the Pages project (`relayforge-ai`)

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_API_BASE_URL` (example: `https://relayforge-ai-api.2257855.workers.dev`)

## Folder structure

```text
apps/
  web/
    src/app
    src/components
    src/hooks
    src/lib
    src/providers
  worker/
    src/core
    src/providers
    src/routes
packages/
  shared/
    src
```

## Technical notes

- The frontend is static by design to fit Cloudflare Pages cleanly
- Streaming uses `fetch` plus SSE event parsing instead of local-only hacks
- The Worker uses modular provider adapters to keep future providers easy to add
- Usage, status, and logs rely on in-memory data structures today but are shaped so durable storage can be added later

## Current limitations

- observability data is in-memory and not durable across Worker instance resets
- fallback during a partially-started upstream stream is not attempted mid-token; interruption is surfaced cleanly instead
- no authentication is included because the public single-workspace demo is more reliable without it
- provider models are configurable, but real production quota management would need persistent storage and stronger controls

## Future extension ideas

- Durable Objects or D1 for persistent logs and usage analytics
- API key management per workspace
- request replay and trace detail pages
- circuit breaker logic based on rolling provider health
- model catalogs and cost-aware routing
- signed demo sessions and rate limiting

## Portfolio positioning

RelayForge AI is intended to present well in screenshots, portfolio reviews, and system design discussions. It demonstrates product taste, cloud deployment awareness, resilience under free-tier constraints, and a stronger architectural story than a basic chat clone.
