"use client";
// The first screen: the seal comes down on the page, the ink spreads, the words follow,
// and a terminal on the right plays a short session with a contract that catches a lie.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Seal } from "@/components/seal";
import { Window } from "@/components/code";

const ease = [0.22, 1, 0.36, 1] as const;

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className="group flex items-center gap-3 rounded-xl border border-line bg-card/70 px-4 py-3 font-mono text-sm text-soft backdrop-blur transition hover:border-hot hover:text-ink"
      aria-label={`Copy ${text}`}
    >
      <span className="text-hot">$</span>
      <span>{text}</span>
      <span className="ml-2 text-xs text-muted transition group-hover:text-hot">{done ? "copied ✓" : "copy"}</span>
    </button>
  );
}

// the session the terminal plays, line by line; `type` lines are typed, the rest appear
type Line = { text: string; cls?: string; type?: boolean; wait?: number };
const SESSION: Line[] = [
  { text: "$ npx inkan check src/app.ts", type: true, cls: "text-term-ink" },
  { text: "", wait: 300 },
  { text: "  印 inkan check  ·  Tea Shop 1.0.0", cls: "text-term-ink font-bold" },
  { text: "", wait: 200 },
  { text: "  GET    /teas/:id", cls: "text-term-ink" },
  { text: "    ✓ found                    200  0.8ms", cls: "text-ok", wait: 380 },
  { text: "    ✗ missing                  200  0.4ms", cls: "text-hot", wait: 380 },
  { text: "        answered 200, expected 404", cls: "text-[#8a7d72]", wait: 260 },
  { text: "", wait: 200 },
  { text: "  2 examples · 1 sealed · 1 broken", cls: "text-term-ink", wait: 300 },
  { text: "", wait: 900 },
  { text: "  the docs said 404. the handler said 200.", cls: "text-[#8a7d72] italic", wait: 400 },
  { text: "  inkan noticed before anyone read it.", cls: "text-[#8a7d72] italic", wait: 2600 },
];

function Session() {
  const still = useReducedMotion();
  const [shown, setShown] = useState<string[]>([]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (still) return; // shown whole, below
    let alive = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      setShown([]);
      await sleep(1300); // after the stamp
      for (let i = 0; i < SESSION.length && alive; i++) {
        const line = SESSION[i];
        if (line.type) {
          for (let c = 1; c <= line.text.length && alive; c++) {
            setShown((s) => [...s.slice(0, i), line.text.slice(0, c)]);
            await sleep(28 + Math.random() * 40);
          }
        } else setShown((s) => [...s.slice(0, i), line.text]);
        await sleep(line.wait ?? 120);
      }
      if (alive) setRun((r) => r + 1); // and again
    })();
    return () => {
      alive = false;
    };
  }, [run, still]);

  const lines = still ? SESSION.map((l) => l.text) : shown;
  return (
    <Window title="PowerShell — inkan check" className="w-full">
      <pre className="h-[340px] overflow-hidden p-5 font-mono text-[12.5px] leading-[1.7] sm:text-[13.5px]">
        {SESSION.map((l, i) => (
          <div key={i} className={l.cls}>
            {lines[i] ?? ""}
            {!still && i === lines.length - 1 && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-hot/80" />}
            {"​"}
          </div>
        ))}
      </pre>
    </Window>
  );
}

export function Hero() {
  const still = useReducedMotion();
  const [landed, setLanded] = useState(Boolean(still));

  return (
    <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
      <div>
        <div className="relative mb-8 h-24 w-24">
          {/* the ink that spreads where the seal lands */}
          <AnimatePresence>
            {landed && !still && (
              <motion.div
                key="ring"
                className="absolute inset-0 rounded-[28px] border-2 border-seal"
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.9, ease }}
              />
            )}
          </AnimatePresence>
          <motion.div
            initial={still ? false : { scale: 2.6, rotate: -22, y: -80, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, mass: 1.1, delay: 0.15 }}
            onAnimationComplete={() => setLanded(true)}
            className="drop-shadow-[0_10px_24px_rgba(196,56,31,.35)]"
          >
            <Seal className="h-24 w-24" ink={false} />
          </motion.div>
        </div>

        <motion.a
          href="https://github.com/inkanjs/inkan/releases/tag/v0.5.0"
          initial={still ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5, ease }}
          className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-card/60 px-3 py-1 font-mono text-xs text-soft hover:border-hot"
        >
          <span className="rounded-full bg-seal px-2 py-0.5 font-bold text-[#fbf1e6]">v0.5.0</span>
          uploads, static files, compression and integrations →
        </motion.a>

        <h1 className="font-mono text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
          {["An API framework", "for Node where", "the docs", "can't lie."].map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={still ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.85 + i * 0.12, duration: 0.7, ease }}
            >
              {i === 3 ? <span className="text-hot">{line}</span> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6, ease }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-soft"
        >
          Write a route with its contract once. inkan checks what comes in, types your handler, checks what goes out, writes
          OpenAPI 3.1, serves the docs and runs every example as a test. On <code className="font-mono text-ink">node:http</code>,
          Bun, Deno and serverless, with zero dependencies.
        </motion.p>

        <motion.div
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Copy text="npm i @vxnsin/inkan" />
          <Link
            href="/docs"
            className="rounded-xl bg-seal px-5 py-3 font-mono text-sm font-bold text-[#fbf1e6] shadow-[0_8px_24px_rgba(196,56,31,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(196,56,31,.45)]"
          >
            Read the docs
          </Link>
          <p className="basis-full font-mono text-xs text-muted">
            or start from a working project: <span className="text-soft">npx @vxnsin/inkan examples</span>
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={still ? false : { opacity: 0, x: 40, rotate: 1.5 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease }}
      >
        <Session />
      </motion.div>
    </section>
  );
}
