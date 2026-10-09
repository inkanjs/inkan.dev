"use client";
// The list on /hanko: a search, one chip per kind, and the cards, grouped by kind.
// `/` jumps to the search from anywhere on the page, Escape clears it.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { hanko, KINDS, type Hanko, type HankoKind } from "@/data/hanko";

type Pick = "all" | HankoKind;

const haystack = (h: Hanko) => [h.name, h.npm, h.description, h.kind, ...(h.tags ?? [])].join(" ").toLowerCase();
const INDEX = hanko.map((h) => ({ h, text: haystack(h) }));

function matches(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return hanko;
  return INDEX.filter(({ text }) => words.every((w) => text.includes(w))).map(({ h }) => h);
}

/** typing into a field: `/` belongs to it then */
const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

/* ---------- small parts ---------- */

/** The kind as a little stamp: the core one is the solid seal, the further from the core, the lighter the ink. */
function Kind({ kind }: { kind: HankoKind }) {
  const look = {
    "built-in": "border-seal bg-seal text-[#fbf1e6]",
    middleware: "border-hot/60 text-hot",
    integration: "border-soft/50 text-soft",
    community: "border-dashed border-muted text-muted",
  }[kind];
  return (
    <span className={`shrink-0 -rotate-2 rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.12em] ${look}`}>
      {kind}
    </span>
  );
}

function Copy({ text, prompt }: { text: string; prompt?: boolean }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <div className="relative z-10 flex items-center gap-2 rounded-lg bg-term py-1.5 pl-3 pr-1.5 font-mono text-xs text-term-ink">
      <code className="min-w-0 flex-1 truncate" title={text}>
        {prompt && <span className="select-none text-[#8a7d72]">$ </span>}
        {text}
      </code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setDone(true);
          } catch {
            /* no clipboard here (an insecure origin, a denied permission): the text is still there to select */
          }
        }}
        className={`shrink-0 rounded-md px-2 py-1 transition ${done ? "text-ok" : "text-[#8a7d72] hover:bg-term-bar hover:text-term-ink"}`}
        aria-label={done ? "Copied" : `Copy ${text}`}
      >
        {done ? "✓ copied" : "copy"}
      </button>
    </div>
  );
}

function Card({ h, still }: { h: Hanko; still: boolean | null }) {
  const internal = h.href.startsWith("/");
  const more = internal ? "docs" : "readme";
  return (
    <motion.li
      layout={!still}
      initial={still ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={still ? undefined : { opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      whileHover={still ? undefined : { y: -3, transition: { type: "spring", stiffness: 500, damping: 30 } }}
      className="group relative flex flex-col rounded-2xl border border-line bg-card/70 p-5 transition-colors hover:border-hot"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words font-mono text-[15px] font-bold leading-snug">
          {/* the whole card is the link; the copy button and the source sit above it */}
          {internal ? (
            <Link href={h.href} className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-hot">
              {h.name}
            </Link>
          ) : (
            <a href={h.href} className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-hot">
              {h.name}
            </a>
          )}
        </h3>
        <Kind kind={h.kind} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-soft">{h.description}</p>
      <div className="mt-auto pt-5">
        {h.npm ? <Copy text={`npm i ${h.npm}`} prompt /> : h.code ? <Copy text={h.code} /> : <p className="py-1.5 font-mono text-xs text-muted">in the core · nothing to import</p>}
        <div className="mt-3 flex items-center gap-3 font-mono text-xs">
          <span className="text-hot transition group-hover:translate-x-0.5">{more} →</span>
          {h.since && <span className="text-muted">needs {h.since}</span>}
          {h.repo && (
            <a href={h.repo} className="relative z-10 ml-auto text-muted transition hover:text-hot">
              source
            </a>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/** Nobody has stamped here yet: an empty seal, and the way in. */
function FirstStamp({ still }: { still: boolean | null }) {
  return (
    <motion.div
      whileHover="press"
      className="grid items-center gap-8 rounded-2xl border border-dashed border-hot/45 p-7 sm:grid-cols-[auto_1fr] sm:p-10"
    >
      <motion.div
        aria-hidden
        variants={still ? undefined : { press: { rotate: -2, scale: 0.94 } }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        className="grid size-24 -rotate-6 place-items-center rounded-[22px] border-2 border-dashed border-hot/40 text-5xl text-hot/30 sm:size-28"
      >
        判
      </motion.div>
      <div>
        <p className="font-mono text-lg font-bold">Be the first stamp here.</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-soft">
          No community plugins yet. Publish yours as <code className="whitespace-nowrap font-mono text-ink">inkan-&lt;name&gt;</code>, add one entry to the
          list in a pull request, and it shows up here next to the official ones.
        </p>
        <Link href="/docs/publish-a-plugin" className="mt-4 inline-block font-mono text-sm text-hot underline-offset-4 hover:underline">
          publish a plugin →
        </Link>
      </div>
    </motion.div>
  );
}

/* ---------- the catalog ---------- */

export function Catalog() {
  const [query, setQuery] = useState("");
  const [pick, setPick] = useState<Pick>("all");
  const field = useRef<HTMLInputElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      e.preventDefault();
      field.current?.focus();
      field.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const found = useMemo(() => matches(query), [query]);
  const count = (k: Pick) => (k === "all" ? found.length : found.filter((h) => h.kind === k).length);
  const groups = KINDS.filter((g) => pick === "all" || g.kind === pick)
    .map((g) => ({ ...g, items: found.filter((h) => h.kind === g.kind) }))
    // a kind with nothing to show is left out, except the community's empty shelf while nobody searches
    .filter((g) => g.items.length > 0 || (g.kind === "community" && !query.trim()));
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="group relative block w-full max-w-xl xl:max-w-md">
          <span className="sr-only">Search hanko</span>
          <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted transition group-focus-within:text-hot">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={field}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              if (query) setQuery("");
              else e.currentTarget.blur();
            }}
            placeholder="auth, sse, vite, headers…"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-line bg-card/70 pl-11 pr-12 font-mono text-sm text-ink outline-none transition placeholder:text-muted focus:border-hot [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted sm:block">/</kbd>
        </label>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Kind">
          {(["all", ...KINDS.map((k) => k.kind)] as Pick[]).map((k) => {
            const on = pick === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => setPick(k)}
                className={`relative rounded-full px-3.5 py-2 font-mono text-sm transition ${on ? "text-[#fbf1e6]" : "text-soft hover:text-ink"}`}
              >
                {on && (
                  <motion.span
                    layoutId={still ? undefined : "hanko-pick"}
                    className="absolute inset-0 rounded-full bg-seal"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">
                  {k === "all" ? "all" : KINDS.find((x) => x.kind === k)!.label}
                  <span className={`ml-1.5 tabular-nums ${on ? "text-[#fbf1e6]/70" : "text-muted"}`}>{count(k)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-muted" aria-live="polite">
        {query.trim() ? `${shown} of ${hanko.length} match “${query.trim()}”` : `${shown} of ${hanko.length}`}
        <span className="hidden sm:inline"> · press / to search, esc to clear</span>
      </p>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-8 text-center sm:p-12">
          <p className="font-mono text-lg font-bold">Nothing stamps “{query.trim()}” yet.</p>
          <p className="mt-2 text-sm text-soft">Maybe it is a few lines of a plugin. Maybe it is yours to publish.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm">
            <button type="button" onClick={() => setQuery("")} className="text-soft underline-offset-4 transition hover:text-ink hover:underline">
              clear the search
            </button>
            <Link href="/docs/publish-a-plugin" className="text-hot underline-offset-4 hover:underline">
              publish a plugin →
            </Link>
          </div>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.kind} className="mt-12 first-of-type:mt-10" aria-labelledby={`hanko-${g.kind}`}>
            <div className="flex flex-col gap-1 border-b border-line pb-3 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 id={`hanko-${g.kind}`} className="font-mono text-xl font-extrabold">
                {g.label} <span className="font-normal tabular-nums text-muted">{g.items.length}</span>
              </h2>
              <p className="text-sm text-muted">{g.note}</p>
            </div>
            {g.items.length === 0 ? (
              <div className="mt-6">
                <FirstStamp still={still} />
              </div>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {g.items.map((h) => (
                    <Card key={h.name} h={h} still={still} />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>
        ))
      )}
    </div>
  );
}
