// Components the MDX pages may use besides the Fumadocs ones.
import type { ReactNode } from "react";
import { run, scenarios, servers } from "@/data/bench";

/**
 * Two code blocks next to each other on a wide screen, one under the other on a narrow one:
 * the old way and the inkan way. The block's title says which is which.
 */
export function Side({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-4 xl:grid-cols-2 [&>figure]:my-3 [&_pre]:text-[0.8rem]">{children}</div>;
}

const REPORTS = "https://github.com/inkanjs/inkan/tree/main/bench/reports";

/** The numbers of data/bench.ts for the servers named, so the page never drifts from /benchmarks. */
export function BenchTable({ names }: { names: string[] }) {
  const rows = names.map((name) => servers.find((s) => s.name === name)).filter((s) => s !== undefined);
  return (
    <>
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-fd-border">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-fd-border text-fd-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">server</th>
              <th className="px-3 py-2 text-right font-medium">score</th>
              {scenarios.map((s) => (
                <th key={s.key} className="px-3 py-2 text-right font-medium" title={s.detail}>
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.name} className="border-b border-fd-border last:border-0">
                <td className={`px-3 py-2 ${s.ours ? "font-bold" : ""}`}>{s.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">{s.score.toFixed(1)}</td>
                {scenarios.map((sc) => (
                  <td key={sc.key} className="px-3 py-2 text-right tabular-nums">
                    {s.values[sc.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-fd-muted-foreground">
        Requests per second next to bare <code>node:http</code> as 100, on Node {run.node}, a {run.machine}, {run.tool},{" "}
        {run.rounds} rounds of {run.seconds} seconds, measured {run.date}. The full runs, with the method and the raw numbers, are
        in <a href={REPORTS}>bench/reports</a>; every scenario is on <a href="/benchmarks">/benchmarks</a>.
      </p>
    </>
  );
}
