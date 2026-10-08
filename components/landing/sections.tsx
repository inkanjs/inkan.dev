"use client";
// The rest of the landing page: how fast, where it fits, and how to learn it.
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Code, Window } from "@/components/code";

/* ---------- how fast ---------- */

// The fair bench from the inkan README: requests per second against plain node:http = 100,
// every server running at once, measurements interleaved.
const BENCH = [
  { name: "inkan on uWS", score: 133.5, ours: true },
  { name: "node:http", score: 100, base: true },
  { name: "Fastify", score: 88.1 },
  { name: "inkan", score: 85.4, ours: true },
  { name: "Hono", score: 85.0 },
  { name: "Express", score: 40.6 },
];

export function Bench() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const still = useReducedMotion();
  const on = seen || still;
  return (
    <section id="bench" data-tone="bench" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-hot">印 how fast</p>
      <h2 className="mt-3 font-mono text-3xl font-extrabold sm:text-4xl">All of that, neck and neck with Fastify.</h2>
      <p className="mt-4 max-w-2xl text-soft">
        Requests per second, with plain <code className="font-mono text-ink">node:http</code> as 100. Every server runs at once
        and the measurements take turns, so a slow moment of the machine hits everyone alike.
      </p>
      <div ref={ref} className="mt-12 grid gap-4">
        {BENCH.map((b, i) => (
          <div key={b.name} className="grid grid-cols-[120px_1fr_64px] items-center gap-4 sm:grid-cols-[160px_1fr_72px]">
            <span className={`font-mono text-sm ${b.ours ? "font-bold text-ink" : "text-soft"}`}>{b.name}</span>
            <div className="h-9 overflow-hidden rounded-lg bg-card">
              <motion.div
                className={`h-full rounded-lg ${b.ours ? "bg-seal" : b.base ? "bg-soft/40" : "bg-muted/35"}`}
                initial={still ? false : { width: 0 }}
                animate={on ? { width: `${(b.score / 140) * 100}%` } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <motion.span
              className={`text-right font-mono text-sm tabular-nums ${b.ours ? "text-hot" : "text-muted"}`}
              initial={still ? false : { opacity: 0 }}
              animate={on ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.08 }}
            >
              {b.score.toFixed(1)}
            </motion.span>
          </div>
        ))}
      </div>
      <p className="mt-6 font-mono text-xs text-muted">
        and every one of those inkan requests was validated, typed and trimmed to its contract.{" "}
        <Link href="/docs/performance" className="text-hot underline underline-offset-4">
          how it is measured →
        </Link>
      </p>
    </section>
  );
}

/* ---------- integrations ---------- */

const INTEGRATIONS = [
  {
    key: "vite",
    name: "@inkanjs/vite",
    line: "The API inside vite dev: one port, no proxy, reloaded on every save.",
    file: "vite.config.ts",
    code: `import inkan from "@inkanjs/vite";

export default {
  plugins: [inkan({ entry: "src/server/app.ts" })],
};
// npm run dev → the frontend, /api, /api/docs, one port`,
  },
  {
    key: "next",
    name: "@inkanjs/next",
    line: "Route handlers in one line, and a typed client for Server Components.",
    file: "app/api/[...path]/route.ts",
    code: `import { handlers } from "@inkanjs/next";
import { app } from "@/server/app";

export const { GET, POST, PUT, PATCH, DELETE } = handlers(app);
// this site runs exactly like that`,
  },
  {
    key: "query",
    name: "@inkanjs/query",
    line: "TanStack Query with keys and types straight from the paths.",
    file: "tea.tsx",
    code: `const q = queries(client<typeof app>(location.origin));

const tea = useQuery(q.get("/teas/:id", { params: { id } }));
tea.data?.name; // typed from the contract
const add = useMutation(q.post("/teas"));`,
  },
  {
    key: "uws",
    name: "@inkanjs/uws",
    line: "uWebSockets.js instead of node:http: the fastest way to run inkan.",
    file: "server.ts",
    code: `import { serve } from "@inkanjs/uws";

const server = await serve(app, { port: 3000 });
// HTTPS, a gentle close, SIGTERM: all there`,
  },
];

export function Integrations() {
  const [active, setActive] = useState(0);
  const it = INTEGRATIONS[active];
  return (
    <section id="integrations" data-tone="integrations" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-hot">印 integrations</p>
      <h2 className="mt-3 font-mono text-3xl font-extrabold sm:text-4xl">inkan where you already are.</h2>
      <p className="mt-4 max-w-2xl text-soft">
        One package each, all in <a className="text-hot underline underline-offset-4" href="https://github.com/inkanjs/integrations">inkanjs/integrations</a>.
        Nuxt, SvelteKit, Astro and Remix need none: <code className="font-mono text-ink">app.fetch</code> is enough.
      </p>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid gap-3">
          {INTEGRATIONS.map((x, i) => (
            <button
              key={x.key}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`relative rounded-xl border px-4 py-3 text-left transition ${i === active ? "border-hot" : "border-line hover:border-soft"}`}
            >
              {i === active && <motion.span layoutId="integration" className="absolute inset-0 rounded-xl bg-seal/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative block font-mono text-sm font-bold">{x.name}</span>
              <span className="relative block text-sm text-soft">{x.line}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={it.key}
            initial={{ opacity: 0, rotateX: -12, y: 16 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: 10, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 900 }}
          >
            <Code title={it.file} code={it.code} />
            <Link href={`/docs/integrations/${it.key}`} className="mt-3 inline-block font-mono text-sm text-hot underline underline-offset-4">
              {it.name} docs →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------- learn ---------- */

const QUEST = [
  { text: "  印 inkan learn · quest 3 of 12 · rules for a body", cls: "font-bold text-term-ink" },
  { text: "", cls: "" },
  { text: "  A body schema is checked before your handler", cls: "text-[#8a7d72]" },
  { text: "  runs. A body that breaks it never reaches you.", cls: "text-[#8a7d72]" },
  { text: "", cls: "" },
  { text: "  Add POST /teas: name at least 1 character,", cls: "text-term-ink" },
  { text: "  grams a whole number of at least 1.", cls: "text-term-ink" },
  { text: "", cls: "" },
  { text: "  ✗ POST /teas with { grams: -5 } answered 201:", cls: "text-hot" },
  { text: "    it got in. Give grams a .min(1)", cls: "text-term-ink" },
  { text: "  ✓ quest 3 done! rules for a body", cls: "font-bold text-ok" },
];

export function Learn() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const still = useReducedMotion();
  const on = seen || still;
  return (
    <section id="learn" data-tone="learn" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <div ref={ref} className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-hot">印 inkan learn</p>
          <h2 className="mt-3 font-mono text-3xl font-extrabold sm:text-4xl">Twelve quests, in your terminal.</h2>
          <p className="mt-4 text-soft">
            A tutorial that watches your file as you save it. Each quest says what to build, checks it against a real app and
            tells you what is missing. Offline, no account.
          </p>
          <code className="mt-6 inline-block rounded-xl border border-line bg-card px-4 py-3 font-mono text-sm">
            <span className="text-hot">$</span> npx @vxnsin/inkan learn
          </code>
        </div>
        <Window title="PowerShell — inkan learn">
          <pre className="p-5 font-mono text-[12.5px] leading-[1.7] sm:text-[13.5px]">
            {QUEST.map((l, i) => (
              <motion.div
                key={i}
                className={l.cls}
                initial={still ? false : { opacity: 0, x: -8 }}
                animate={on ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * (i >= 8 ? 0.45 : 0.08), duration: 0.35 }}
              >
                {l.text}
                {"​"}
              </motion.div>
            ))}
          </pre>
        </Window>
      </div>
    </section>
  );
}
