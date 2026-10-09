"use client";
// Hanko on the landing page: a sheet of stamps, pressed one after the other as it comes into
// view. Each stamp is something an inkan app can carry, and leads to its docs.
import { motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { hanko, KINDS, type HankoKind } from "@/data/hanko";

// What the sheet shows: every official package, then the built-ins people ask for first.
const PICK = [
  "@inkanjs/auth",
  "app.ws",
  "@inkanjs/session",
  "app.job",
  "@inkanjs/secure-headers",
  "every",
  "@inkanjs/etag",
  "env",
  "@inkanjs/idempotency",
  "pressure",
  "@inkanjs/proxy",
  "cache",
  "@inkanjs/circuit-breaker",
  "context()",
  "@inkanjs/otel",
  "@inkanjs/next",
];
const STAMPS = PICK.map((name) => hanko.find((h) => h.name === name)).filter((h) => h !== undefined);

// a stamp is never pressed quite straight: a small tilt per stamp, the same on every render
const tilt = (i: number) => ((i * 37) % 9) - 4;
// the name without its scope, free to break after a hyphen and nowhere else
const short = (name: string) =>
  name
    .replace(/^@inkanjs\//, "")
    .split("-")
    .flatMap((part, i) => (i ? [<wbr key={i} />, "-" + part] : [part]));

const COUNTED: HankoKind[] = ["built-in", "middleware", "integration", "recipe"];

export function Hanko() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const still = useReducedMotion();
  const on = seen || still;
  return (
    <section id="hanko" data-tone="hanko" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-sm text-hot">印 hanko</p>
          <h2 className="mt-3 font-mono text-3xl font-extrabold sm:text-4xl">
            Stamps for the rest <span className="text-muted">判子</span>
          </h2>
          <p className="mt-4 text-soft">
            Login, sessions, websockets, jobs on a schedule, a proxy, tracing. What does not belong in every app comes as a
            stamp you press onto it: one line to register, typed all the way to the client, and listed in your docs.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COUNTED.map((kind) => {
              const k = KINDS.find((x) => x.kind === kind)!;
              return (
                <div key={kind} className="rounded-xl border border-line bg-card/60 px-3 py-3">
                  <dt className="font-mono text-xs text-muted">{k.label}</dt>
                  <dd className="mt-1 font-mono text-2xl font-extrabold tabular-nums text-ink">
                    {hanko.filter((h) => h.kind === kind).length}
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-4 font-mono text-xs text-muted">
            no official middleware brings a dependency along; otel wants @opentelemetry/api beside it
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-sm">
            <Link
              href="/hanko"
              className="rounded-xl bg-seal px-5 py-3 font-bold text-[#fbf1e6] shadow-[0_8px_24px_rgba(196,56,31,.35)] transition hover:-translate-y-0.5"
            >
              Browse hanko
            </Link>
            <Link href="/docs/plugins" className="text-hot underline underline-offset-4">
              stamp your own →
            </Link>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="A few of the stamps">
          {STAMPS.map((s, i) => (
            <motion.li
              key={s.name}
              initial={still ? false : { opacity: 0, scale: 1.5, rotate: tilt(i) - 10 }}
              animate={on ? { opacity: 1, scale: 1, rotate: tilt(i) } : {}}
              transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 420, damping: 22 }}
            >
              <Link
                href={s.href}
                title={s.description}
                className="group flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-seal/70 bg-seal/[0.06] p-2 text-center transition hover:-translate-y-0.5 hover:border-seal hover:bg-seal/[0.12]"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-hot/80">
                  {s.kind === "built-in" ? "core" : s.kind === "integration" ? "with" : "@inkanjs"}
                </span>
                <span className="font-mono text-[13px] font-bold leading-tight text-ink sm:text-sm">{short(s.name)}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
