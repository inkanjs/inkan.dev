"use client";
// The board on /benchmarks: pick the score or one scenario, and the bars sort themselves.
// Below, every scenario of every server at once, coloured against node:http.
import { LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { scenarios, servers, type ScenarioKey } from "@/data/bench";

type Pick = "score" | ScenarioKey;

const valueOf = (s: (typeof servers)[number], pick: Pick) => (pick === "score" ? s.score : s.values[pick]);

/** A cell coloured by how it does against node:http: red above, grey around, faded below. */
function tone(v: number) {
  if (v >= 110) return "bg-seal text-[#fbf1e6] font-bold";
  if (v >= 100) return "bg-seal/30 text-ink font-bold";
  if (v >= 85) return "bg-soft/15 text-ink";
  if (v >= 60) return "bg-soft/8 text-soft";
  return "text-muted";
}

export function Board() {
  const [pick, setPick] = useState<Pick>("score");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  const still = useReducedMotion();
  const on = seen || still;
  const sorted = [...servers].sort((a, b) => valueOf(b, pick) - valueOf(a, pick));
  const max = Math.max(...servers.map((s) => valueOf(s, pick)));
  const detail = pick === "score" ? "the geometric mean over all twelve scenarios of the run" : scenarios.find((s) => s.key === pick)!.detail;

  return (
    <div ref={ref}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Scenario">
        {(["score", ...scenarios.map((s) => s.key)] as Pick[]).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={pick === k}
            onClick={() => setPick(k)}
            className={`relative rounded-full px-4 py-2 font-mono text-sm transition ${pick === k ? "text-[#fbf1e6]" : "text-soft hover:text-ink"}`}
          >
            {pick === k && <motion.span layoutId="bench-pick" className="absolute inset-0 rounded-full bg-seal" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="relative">{k === "score" ? "score" : scenarios.find((s) => s.key === k)!.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-muted">{detail} · node:http = 100 · higher is better</p>

      <LayoutGroup>
        <ol className="mt-8 grid gap-3">
          {sorted.map((s, i) => {
            const v = valueOf(s, pick);
            return (
              <motion.li
                key={s.name}
                layout={!still}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="grid grid-cols-[28px_1fr] items-center gap-3 sm:grid-cols-[28px_220px_1fr_70px]"
              >
                <span className="font-mono text-sm text-muted">{i + 1}</span>
                <span className="min-w-0">
                  <span className={`block truncate font-mono text-sm ${s.ours ? "font-bold text-ink" : "text-soft"}`}>{s.name}</span>
                  <span className="block truncate text-xs text-muted">{s.what}</span>
                </span>
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                  <div className="h-8 flex-1 overflow-hidden rounded-lg bg-card">
                    <motion.div
                      className={`h-full rounded-lg ${s.ours ? "bg-seal" : s.base ? "bg-soft/45" : "bg-muted/35"}`}
                      initial={still ? false : { width: 0 }}
                      animate={on ? { width: `${(v / max) * 100}%` } : {}}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: on && !seen ? 0 : i * 0.05 }}
                    />
                  </div>
                  <span className={`w-14 text-right font-mono text-sm tabular-nums sm:hidden ${s.ours ? "text-hot" : "text-muted"}`}>{v.toFixed(pick === "score" ? 1 : 0)}</span>
                </div>
                <span className={`hidden text-right font-mono text-sm tabular-nums sm:block ${s.ours ? "text-hot" : "text-muted"}`}>
                  {v.toFixed(pick === "score" ? 1 : 0)}
                  {pick !== "score" && <span className="text-muted">%</span>}
                </span>
              </motion.li>
            );
          })}
        </ol>
      </LayoutGroup>

      <div className="mt-16 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] border-collapse font-mono text-sm">
          <thead>
            <tr className="bg-card text-left text-xs text-muted">
              <th className="px-4 py-3 font-normal">server</th>
              <th className="px-3 py-3 text-right font-normal">score</th>
              {scenarios.map((s) => (
                <th key={s.key} className="px-3 py-3 text-right font-normal">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servers.map((s, r) => (
              <motion.tr
                key={s.name}
                className="border-t border-line"
                initial={still ? false : { opacity: 0, y: 8 }}
                animate={on ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + r * 0.06 }}
              >
                <td className={`px-4 py-2.5 ${s.ours ? "font-bold" : "text-soft"}`}>{s.name}</td>
                <td className={`px-3 py-2.5 text-right tabular-nums ${s.ours ? "font-bold text-hot" : ""}`}>{s.score.toFixed(1)}</td>
                {scenarios.map((sc) => (
                  <td key={sc.key} className="px-1.5 py-1.5 text-right">
                    <span className={`block rounded-md px-2 py-1 tabular-nums ${tone(s.values[sc.key])}`}>{s.values[sc.key]}%</span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
