"use client";
// inkan studio, in a browser window that runs by itself: requests arrive, the sparklines draw,
// the map grows, jobs fill up. The tabs turn every few seconds while the section is on screen.
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Window } from "@/components/code";

const TABS = ["live", "routes", "map", "jobs"] as const;
type Tab = (typeof TABS)[number];
const METHOD: Record<string, string> = { GET: "text-[#79c08a]", POST: "text-[#7fa8e6]", DELETE: "text-[#e65d3e]", WS: "text-[#b897e0]" };
const POOL = [
  { m: "GET", p: "/teas", s: 200, ms: 0.4 },
  { m: "GET", p: "/teas/1", s: 200, ms: 1.2 },
  { m: "GET", p: "/teas/abc", s: 400, ms: 0.3, note: "input broke the contract" },
  { m: "POST", p: "/teas", s: 201, ms: 2.1, note: "via MCP tool postTeas" },
  { m: "GET", p: "/teas/9", s: 404, ms: 0.6 },
  { m: "POST", p: "/exports", s: 202, ms: 0.5 },
];
const FEATURES: Record<Tab, string> = {
  live: "Every request as it comes, with replay, and a click turns it into an example.",
  routes: "Every route with its calls, its p95 and what broke, sorted by the slowest.",
  map: "The app as a tree of its paths, with tools and auth at each.",
  jobs: "The queues, the schedule, progress as it happens, and cancel.",
};

export function Studio() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin: "-20% 0px" });
  const still = useReducedMotion();
  const [tab, setTab] = useState<Tab>("live");
  const [held, setHeld] = useState(false); // a tab someone picked stays
  const [tick, setTick] = useState(0);
  const live = seen && !still;

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setTick((n) => n + 1), 700);
    return () => clearInterval(t);
  }, [live]);
  useEffect(() => {
    if (!live || held) return;
    const t = setInterval(() => setTab((x) => TABS[(TABS.indexOf(x) + 1) % TABS.length]!), 4200);
    return () => clearInterval(t);
  }, [live, held]);

  return (
    <section id="studio" data-tone="studio" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <div ref={ref}>
        <p className="font-mono text-sm text-hot">印 coming in 0.11 · inkan studio</p>
        <h2 className="mt-3 max-w-3xl font-mono text-3xl font-extrabold leading-tight sm:text-4xl">Watch your app while it runs.</h2>
        <p className="mt-4 max-w-2xl text-soft">
          Open <code className="text-ink">/_inkan</code> while you develop. No account, no agent, nothing to install: the studio is a
          page the app serves itself, from what it already knows about every route. Behind a password with{" "}
          <code className="text-ink">protect</code>, it runs in production too.
        </p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.8fr_1.6fr]">
          <ul className="grid gap-2" role="tablist">
            {TABS.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={t === tab}
                  onClick={() => {
                    setTab(t);
                    setHeld(true);
                  }}
                  className="relative w-full rounded-xl px-4 py-3 text-left transition"
                >
                  {t === tab && <motion.span layoutId="studio-tab" className="absolute inset-0 rounded-xl border border-hot/50 bg-card" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative block font-mono text-sm font-bold">{t}</span>
                  <span className="relative block text-sm text-soft">{FEATURES[t]}</span>
                  {t === tab && live && !held && (
                    <motion.span key={`bar-${t}`} className="absolute bottom-1 left-4 right-4 h-0.5 origin-left rounded bg-seal/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.2, ease: "linear" }} />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <motion.div
            initial={still ? false : { opacity: 0, y: 40, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
            className="min-w-0"
          >
            <Window title="localhost:3000/_inkan">
              <div className="flex items-center gap-4 border-b border-[#3b332d] px-4 font-mono text-xs">
                {TABS.map((t) => (
                  <span key={t} className={`relative py-2.5 ${t === tab ? "text-[#e65d3e]" : "text-[#a3958a]"}`}>
                    {t}
                    {t === tab && <motion.span layoutId="studio-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#e65d3e]" />}
                  </span>
                ))}
                <span className="ml-auto flex items-center gap-1.5 text-[#79c08a]">
                  <motion.span className="size-1.5 rounded-full bg-[#79c08a]" animate={live ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 1.6, repeat: Infinity }} />
                  live
                </span>
              </div>
              <Kpis tick={tick} />
              <div className="h-[250px] overflow-hidden px-4 pb-4 font-mono text-[12px]">
                <AnimatePresence mode="wait">
                  <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {tab === "live" && <Live tick={tick} />}
                    {tab === "routes" && <Routes />}
                    {tab === "map" && <MapTree />}
                    {tab === "jobs" && <Jobs tick={tick} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Window>
          </motion.div>
        </div>
        <Link href="/docs/studio" className="mt-8 inline-block font-mono text-sm text-hot hover:underline">
          what is in it →
        </Link>
      </div>
    </section>
  );
}

const wave = (tick: number, k: number) => Array.from({ length: 14 }, (_, i) => 12 + 9 * Math.sin((i + tick) / k) + 5 * Math.sin((i * 2 + tick) / (k + 1.7)));
const path = (v: number[]) => v.map((y, i) => `${i ? "L" : "M"}${(i * 100) / (v.length - 1)},${28 - y}`).join(" ");

function Kpis({ tick }: { tick: number }) {
  const items = [
    { label: "requests / min", value: 84 + (tick % 7), color: "#e65d3e", k: 2.2 },
    { label: "p95", value: `${(2.1 + (tick % 5) * 0.3).toFixed(1)}ms`, color: "#7fa8e6", k: 3.1 },
    { label: "heap", value: "17 MB", color: "#79c08a", k: 5 },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {items.map((it) => (
        <div key={it.label} className="min-w-0 rounded-lg border border-[#3b332d] bg-[#231e1b] px-3 py-2">
          <div className="truncate font-mono text-[10px] uppercase tracking-wider text-[#a3958a]">{it.label}</div>
          <div className="font-mono text-lg font-bold">{it.value}</div>
          <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="mt-1 h-6 w-full">
            <motion.path d={path(wave(tick, it.k))} fill="none" stroke={it.color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1, d: path(wave(tick, it.k)) }} transition={{ duration: 0.6 }} />
          </svg>
        </div>
      ))}
    </div>
  );
}

function Live({ tick }: { tick: number }) {
  const rows = Array.from({ length: 7 }, (_, i) => ({ ...POOL[(tick + 7 - i) % POOL.length]!, id: tick - i }));
  return (
    <div className="grid gap-1">
      <AnimatePresence initial={false}>
        {rows.map((r) => (
          <motion.div
            key={r.id}
            layout
            initial={{ opacity: 0, x: -20, backgroundColor: "rgba(230,93,62,.25)" }}
            animate={{ opacity: 1, x: 0, backgroundColor: "rgba(230,93,62,0)" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-[44px_1fr_40px_52px] items-center gap-2 rounded px-2 py-1 sm:grid-cols-[44px_1fr_40px_52px_1.2fr]"
          >
            <span className={`font-bold ${METHOD[r.m]}`}>{r.m}</span>
            <span className="truncate">{r.p}</span>
            <span className={r.s >= 400 ? "text-[#e0a84a]" : "text-[#79c08a]"}>{r.s}</span>
            <span className="text-[#a3958a]">{r.ms}ms</span>
            <span className={`hidden truncate sm:block ${r.note?.startsWith("via") ? "text-[#b897e0]" : "text-[#e65d3e]"}`}>{r.note ?? ""}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Routes() {
  const routes = [
    { m: "POST", p: "/teas", p95: 4.2, auth: true },
    { m: "GET", p: "/teas/:id", p95: 2.6 },
    { m: "GET", p: "/exports/:id", p95: 1.1 },
    { m: "GET", p: "/teas", p95: 0.8 },
    { m: "DELETE", p: "/teas/:id", p95: 0.5 },
  ];
  return (
    <div className="grid gap-2 pt-1">
      {routes.map((r, i) => (
        <div key={r.p + r.m} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 sm:grid-cols-[52px_120px_1fr_auto]">
          <span className={`font-bold ${METHOD[r.m]}`}>{r.m}</span>
          <span className="truncate">{r.p}</span>
          <div className="hidden h-2 overflow-hidden rounded bg-[#231e1b] sm:block">
            <motion.div className="h-full rounded bg-[#e65d3e]" initial={{ width: 0 }} animate={{ width: `${(r.p95 / 4.5) * 100}%` }} transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <span className="whitespace-nowrap text-[#a3958a]">
            {r.p95}ms {r.auth && <span className="text-[#e0a84a]">auth</span>} <span className="text-[#b897e0]">tool</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function MapTree() {
  const lines: [number, string, string[]][] = [
    [0, "/", []],
    [1, "teas", ["GET", "POST"]],
    [2, ":id", ["GET", "DELETE"]],
    [1, "exports", ["POST"]],
    [2, ":id", ["GET", "DELETE"]],
    [3, "events", ["GET"]],
    [1, "live", ["WS"]],
  ];
  return (
    <div className="grid gap-1 pt-1">
      {lines.map(([depth, name, methods], i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09, type: "spring", stiffness: 260, damping: 22 }} className="flex items-center gap-2" style={{ paddingLeft: depth * 22 }}>
          {depth > 0 && <span className="text-[#5a4f47]">└</span>}
          <span className={`font-bold ${name.startsWith(":") ? "text-[#b897e0]" : ""}`}>{name}</span>
          {methods.map((m) => (
            <span key={m} className={`text-[10px] font-bold ${METHOD[m]}`}>
              {m}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function Jobs({ tick }: { tick: number }) {
  const jobs = [0, 1, 2].map((i) => {
    const p = Math.min(100, (tick * 9 + i * 37) % 130);
    return { id: ["q7Vx2", "Kf91a", "Zt0pL"][i]!, p, state: p >= 100 ? "done" : i === 2 && p < 30 ? "queued" : "running" };
  });
  return (
    <div className="grid gap-3 pt-1">
      <div className="text-[#a3958a]">/exports · 2 of 2 slots · next run of */5 * * * * in 3m</div>
      {jobs.map((j) => (
        <div key={j.id} className="grid grid-cols-[64px_70px_1fr_40px] items-center gap-3">
          <span>{j.id}</span>
          <span className={j.state === "done" ? "text-[#79c08a]" : j.state === "queued" ? "text-[#e0a84a]" : "text-[#7fa8e6]"}>{j.state}</span>
          <div className="h-2 overflow-hidden rounded bg-[#231e1b]">
            <motion.div className="h-full rounded bg-[#7fa8e6]" animate={{ width: `${j.state === "queued" ? 0 : j.p}%`, backgroundColor: j.state === "done" ? "#79c08a" : "#7fa8e6" }} transition={{ duration: 0.6 }} />
          </div>
          <span className="text-[#a3958a]">{j.state === "queued" ? "" : `${j.p}%`}</span>
        </div>
      ))}
    </div>
  );
}
