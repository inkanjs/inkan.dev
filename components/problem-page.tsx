"use client";
// 404 and 500 as inkan answers them: an RFC 9457 problem, with the way back next to it.
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import type { ReactNode } from "react";
import { Seal } from "@/components/seal";

const WAYS = [
  { href: "/docs", label: "Docs", note: "start at the contract" },
  { href: "/hanko", label: "Hanko", note: "plugins, middleware, stores" },
  { href: "/blog", label: "Blog", note: "what changed lately" },
  { href: "/", label: "Home", note: "the front page" },
];

function SearchButton() {
  const { setOpenSearch } = useSearchContext();
  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="rounded-xl border border-line px-4 py-2.5 font-mono text-sm text-soft transition hover:border-hot hover:text-ink"
    >
      Search the docs <span className="ml-2 text-muted">⌘K</span>
    </button>
  );
}

function Response({ status, reason, problem }: { status: number; reason: string; problem: Record<string, string | number> }) {
  const entries = Object.entries(problem);
  return (
    <div className="overflow-hidden rounded-2xl bg-term text-term-ink shadow-[0_30px_70px_rgba(0,0,0,.35),0_0_0_1px_rgba(255,255,255,.04)]">
      <div className="flex h-11 items-center gap-2 bg-term-bar px-4">
        <span className="size-3 rounded-full bg-[#e2583e]" />
        <span className="size-3 rounded-full bg-[#e3b341]" />
        <span className="size-3 rounded-full bg-[#79c08a]" />
        <span className="ml-3 font-mono text-xs text-[#8a7d72]">response</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
        <span className="text-[#8a7d72]">HTTP/1.1 </span>
        <span className="font-bold text-[#e2583e]">
          {status} {reason}
        </span>
        {"\n"}
        <span className="text-[#8a7d72]">content-type: </span>application/problem+json{"\n\n"}
        {"{\n"}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {"  "}
            <span className="font-semibold">&quot;{k}&quot;</span>:{" "}
            {typeof v === "number" ? <span className="text-[#e3b341]">{v}</span> : <span className="text-[#79c08a]">&quot;{v}&quot;</span>}
            {i < entries.length - 1 ? "," : ""}
            {"\n"}
          </span>
        ))}
        {"}"}
      </pre>
    </div>
  );
}

export function ProblemPage({
  status,
  reason,
  headline,
  children,
  detail,
  extra,
  actions,
  search = true,
}: {
  status: number;
  reason: string;
  headline: string;
  children: ReactNode;
  /** `{path}` becomes the address asked for */
  detail: string;
  extra?: Record<string, string>;
  actions?: ReactNode;
  search?: boolean;
}) {
  const path = usePathname() ?? "/";
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
      <section className="relative">
        <motion.div
          aria-hidden
          initial={{ scale: 1.6, rotate: -24, opacity: 0 }}
          animate={{ scale: 1, rotate: -10, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="pointer-events-none absolute -top-6 right-0 sm:right-6"
        >
          <Seal className="size-20 drop-shadow-[0_10px_30px_var(--glow)] sm:size-24" />
        </motion.div>
        <p className="font-mono text-sm text-hot">印 {status}</p>
        <h1 className="mt-3 max-w-md pr-20 font-mono text-4xl font-extrabold leading-tight sm:pr-0 sm:text-5xl">{headline}</h1>
        <div className="mt-5 max-w-lg text-lg text-soft">{children}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {actions}
          {search && <SearchButton />}
        </div>
        <ul className="mt-10 grid max-w-lg gap-2 sm:grid-cols-2">
          {WAYS.map((w) => (
            <li key={w.href}>
              <Link href={w.href} className="group block rounded-xl border border-line bg-card/70 px-4 py-3 transition hover:border-hot/60">
                <span className="font-mono text-sm font-bold group-hover:text-hot">{w.label} →</span>
                <span className="mt-0.5 block text-sm text-muted">{w.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Response status={status} reason={reason} problem={{ type: "about:blank", title: reason, status, detail: detail.replace("{path}", path), instance: path, ...extra }} />
        <p className="mt-4 font-mono text-xs text-muted">An inkan app answers every error like this: application/problem+json, RFC 9457.</p>
      </motion.div>
    </main>
  );
}
