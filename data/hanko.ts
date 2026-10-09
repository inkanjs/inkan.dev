// What /hanko lists: everything that stamps onto an inkan app.
// Community packages with the npm keyword inkan-plugin are listed by themselves (lib/hanko.ts).
// An entry here is for a better line, tags or a docs link: add it under "community" in a pull request.
// See /docs/publish-a-plugin.

export type HankoKind = "built-in" | "middleware" | "integration" | "recipe" | "community";

export type Hanko = {
  /** the package name, or what you write in code for a built-in */
  name: string;
  /** one line: what it does, not how good it is */
  description: string;
  kind: HankoKind;
  /** the docs page for an official one, the README or npm page for a community one */
  href: string;
  /** the npm package, when there is one to install */
  npm?: string;
  repo?: string;
  tags?: string[];
  /** a built-in's one line of code: how it comes out of the core */
  code?: string;
  /** the inkan version it needs, while that version is still on its way */
  since?: string;
  /* filled from npm for the packages found there, never written by hand */
  version?: string;
  /** the last publish, as a date to show */
  published?: string;
  /** downloads last week */
  weekly?: number;
  /** runtime dependencies, when npm says */
  deps?: number;
};

export const KINDS: { kind: HankoKind; label: string; note: string }[] = [
  { kind: "built-in", label: "built-in", note: "In the core. Nothing to install, nothing to keep in step." },
  { kind: "middleware", label: "middleware", note: "Official packages under @inkanjs, each a shared plugin." },
  { kind: "integration", label: "integrations", note: "inkan where you already are. One package each." },
  { kind: "recipe", label: "recipes", note: "Not packages: a few lines of your own, on the driver you already use." },
  { kind: "community", label: "community", note: "Written by others, listed here, maintained by their authors." },
];

const CORE = "https://github.com/inkanjs/inkan";
const MIDDLEWARE = "https://github.com/inkanjs/middleware";
const INTEGRATIONS = "https://github.com/inkanjs/integrations";

export const hanko: Hanko[] = [
  /* ---------- built-in ---------- */
  {
    name: "cors",
    description: "Lets pages on other origins call the API: preflights and the access-control headers.",
    kind: "built-in",
    href: "/docs/built-in/cors",
    repo: CORE,
    code: `import { cors } from "@vxnsin/inkan"`,
    tags: ["middleware", "headers", "browser", "preflight"],
  },
  {
    name: "rateLimit",
    description: "At most so many requests per client and window, keyed on ctx.ip.",
    kind: "built-in",
    href: "/docs/built-in/rate-limit",
    repo: CORE,
    code: `import { rateLimit } from "@vxnsin/inkan"`,
    tags: ["middleware", "security", "throttle", "429"],
  },
  {
    name: "compress",
    description: "Brotli or gzip, as the client takes it.",
    kind: "built-in",
    href: "/docs/built-in/compress",
    repo: CORE,
    code: `import { compress } from "@vxnsin/inkan"`,
    tags: ["middleware", "brotli", "gzip", "performance"],
  },
  {
    name: "serveStatic",
    description: "The built frontend next to the API, with the fallback a single-page app needs.",
    kind: "built-in",
    href: "/docs/built-in/static",
    repo: CORE,
    code: `import { serveStatic } from "@vxnsin/inkan"`,
    tags: ["middleware", "files", "spa", "frontend"],
  },
  {
    name: "openapi + /docs",
    description: "OpenAPI 3.1 at /openapi.json and a docs page at /docs, from the same schemas. Every example gets a send button.",
    kind: "built-in",
    href: "/docs/api/app#openapi-routes-sealed",
    repo: CORE,
    tags: ["openapi", "swagger", "docs", "schemas"],
  },
  {
    name: "response",
    description: "Only what the contract lists leaves the server. In development, an answer that breaks it is a 500 that says which field.",
    kind: "built-in",
    href: "/docs/api/routing#response",
    repo: CORE,
    tags: ["validation", "contract", "schemas", "security"],
  },
  {
    name: "client",
    description: "A client typed from the app itself, without code generation.",
    kind: "built-in",
    href: "/docs/client",
    repo: CORE,
    code: `import { client } from "@vxnsin/inkan/client"`,
    tags: ["types", "fetch", "frontend", "rpc"],
  },
  {
    name: "inkan check",
    description: "Examples show up in the docs and run as tests: in-process, no port. Routes without one are listed.",
    kind: "built-in",
    href: "/docs/examples",
    repo: CORE,
    tags: ["testing", "examples", "cli", "ci"],
  },
  {
    name: "inkan seal",
    description: "Every contract's check stamped into plain code ahead of time, in a file you can read and commit. No eval.",
    kind: "built-in",
    href: "/docs/seal",
    repo: CORE,
    tags: ["performance", "cli", "build", "validation"],
  },
  {
    name: "sse · streams · uploads",
    description: "Streams out, server-sent events with a schema per event, multipart uploads and forms in.",
    kind: "built-in",
    href: "/docs/streams",
    repo: CORE,
    code: `import { sse, t } from "@vxnsin/inkan"`,
    tags: ["sse", "events", "multipart", "forms", "files", "streaming"],
  },
  {
    name: "app.job",
    description: "Work that takes longer than a request: a queue, progress over SSE, and the result.",
    kind: "built-in",
    href: "/docs/jobs",
    repo: CORE,
    since: "0.7.0",
    tags: ["queue", "background", "sse", "progress"],
  },
  {
    name: "cache",
    description: "Keeps a route's answers for a while. Requests that arrive meanwhile wait for that one answer.",
    kind: "built-in",
    href: "/docs/api/routing#cache",
    repo: CORE,
    tags: ["performance", "memory", "route"],
  },
  {
    name: "html · render",
    description: "HTML from a tagged template that escapes every value, in the layout of the route's scope.",
    kind: "built-in",
    href: "/docs/api/context#html",
    repo: CORE,
    code: `import { html } from "@vxnsin/inkan"`,
    tags: ["html", "templates", "layout", "ssr"],
  },
  {
    name: "problem",
    description: "Every error in one shape: RFC 9457 problem documents with a stable type to switch on.",
    kind: "built-in",
    href: "/docs/api/problems",
    repo: CORE,
    code: `import { problem } from "@vxnsin/inkan"`,
    tags: ["errors", "rfc 9457"],
  },
  {
    name: "/_inkan",
    description: "A live log of the last 200 requests and what broke the contract. Development only, loopback only.",
    kind: "built-in",
    href: "/docs/api/app#options",
    repo: CORE,
    tags: ["inspector", "debugging", "dev"],
  },

  /* ---------- middleware ---------- */
  {
    name: "@inkanjs/auth",
    description: "Sessions, JWTs, API keys and basic auth, roles, CSRF, 2FA, OAuth and refresh tokens, on node:crypto alone.",
    kind: "middleware",
    href: "/docs/official/auth",
    npm: "@inkanjs/auth",
    repo: MIDDLEWARE,
    since: "0.7.0",
    tags: ["auth", "jwt", "oauth", "login", "totp", "csrf", "security"],
  },
  {
    name: "@inkanjs/session",
    description: "Cookie sessions: signed, encrypted, or a random id in front of a store. Typed on ctx.session.",
    kind: "middleware",
    href: "/docs/official/session",
    npm: "@inkanjs/session",
    repo: MIDDLEWARE,
    since: "0.7.0",
    tags: ["session", "cookies", "store"],
  },
  {
    name: "@inkanjs/secure-headers",
    description: "A strict Content-Security-Policy with nonces, HSTS, and the rest.",
    kind: "middleware",
    href: "/docs/official/secure-headers",
    npm: "@inkanjs/secure-headers",
    repo: MIDDLEWARE,
    since: "0.7.0",
    tags: ["security", "csp", "hsts", "headers", "helmet"],
  },
  {
    name: "@inkanjs/etag",
    description: "ETags and 304 Not Modified, hashed before compression.",
    kind: "middleware",
    href: "/docs/official/etag",
    npm: "@inkanjs/etag",
    repo: MIDDLEWARE,
    since: "0.7.0",
    tags: ["caching", "304", "conditional requests", "headers"],
  },
  {
    name: "@inkanjs/idempotency",
    description: "Idempotency-Key: a POST sent twice runs once.",
    kind: "middleware",
    href: "/docs/official/idempotency",
    npm: "@inkanjs/idempotency",
    repo: MIDDLEWARE,
    since: "0.7.0",
    tags: ["payments", "retries", "headers", "store"],
  },

  /* ---------- integrations ---------- */
  {
    name: "@inkanjs/next",
    description: "An inkan app in Next.js: route handlers, the Pages Router, a typed client for Server Components.",
    kind: "integration",
    href: "/docs/integrations/next",
    npm: "@inkanjs/next",
    repo: INTEGRATIONS,
    tags: ["next.js", "react", "server components"],
  },
  {
    name: "@inkanjs/vite",
    description: "Your inkan API inside the Vite dev server: one port, reloaded on every save.",
    kind: "integration",
    href: "/docs/integrations/vite",
    npm: "@inkanjs/vite",
    repo: INTEGRATIONS,
    tags: ["vite", "dev server", "vue", "react", "svelte"],
  },
  {
    name: "@inkanjs/query",
    description: "The typed client for TanStack Query: keys and data from the contract, problems as errors.",
    kind: "integration",
    href: "/docs/integrations/query",
    npm: "@inkanjs/query",
    repo: INTEGRATIONS,
    tags: ["tanstack", "react query", "client", "types"],
  },
  {
    name: "@inkanjs/uws",
    description: "uWebSockets.js instead of node:http: the fastest way to run inkan.",
    kind: "integration",
    href: "/docs/integrations/uws",
    npm: "@inkanjs/uws",
    repo: INTEGRATIONS,
    tags: ["uwebsockets", "performance", "server", "runtime"],
  },

  /* ---------- recipes: no package, a page of the docs ---------- */
  {
    name: "postgres",
    description: "A pg Pool on ctx.db: checked at start, closed after the last request, a transaction per request when you need one.",
    kind: "recipe",
    href: "/docs/recipes/databases#postgres-pg",
    code: `app.decorate("db", new pg.Pool())`,
    tags: ["database", "sql", "pg", "postgresql"],
  },
  {
    name: "redis",
    description: "ioredis on ctx.redis: connected in onListen, quit in onClose, multi() for commands that belong together.",
    kind: "recipe",
    href: "/docs/recipes/databases#redis-ioredis",
    code: `app.decorate("redis", new Redis(url))`,
    tags: ["database", "cache", "ioredis", "key-value"],
  },
  {
    name: "mongodb",
    description: "The official driver's Db on ctx.db, typed collections, and transactions on a replica set.",
    kind: "recipe",
    href: "/docs/recipes/databases#mongodb",
    code: `app.decorate("db", mongo.db("shop"))`,
    tags: ["database", "nosql", "mongo", "documents"],
  },
  {
    name: "prisma",
    description: "A Prisma client on ctx.db, typed from the schema, with $transaction for work that succeeds or fails as one.",
    kind: "recipe",
    href: "/docs/recipes/databases#prisma",
    code: `app.decorate("db", new PrismaClient())`,
    tags: ["database", "orm", "sql", "postgresql"],
  },

  /* ---------- community ----------
     {
       name: "inkan-<name>",
       description: "One line: what it does.",
       kind: "community",
       href: "https://github.com/you/inkan-<name>#readme",
       npm: "inkan-<name>",
       repo: "https://github.com/you/inkan-<name>",
       tags: ["…"],
     },
  */
];

/** npm packages with the keyword that are kept off the page: misuse of the keyword, or gone stale */
export const hidden: string[] = [];
