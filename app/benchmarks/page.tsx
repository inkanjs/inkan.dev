import type { Metadata } from "next";
import { Board } from "@/components/benchmarks/board";
import { Code } from "@/components/code";
import { Footer, Nav } from "@/components/landing/chrome";
import { run, scenarios, servers } from "@/data/bench";

export const metadata: Metadata = {
  title: "Benchmarks",
  description: "inkan against node:http, Fastify, Hono and Express: every scenario, how it is measured, and how to run it yourself.",
};

const by = (name: string) => servers.find((s) => s.name === name)!;
const times = (a: number, b: number) => `${(a / b).toFixed(1)}×`;

const METHOD = [
  { title: "The same work", text: "inkan and Fastify check with schemas, the others by hand. Nobody wins by skipping the check." },
  { title: "Right answers first", text: "Before a server is measured on a scenario, its answer is checked. A wrong or empty answer is not fast, it is wrong." },
  { title: "All at once, taking turns", text: "Every server runs for the whole bench, and each scenario is measured for all of them back to back. A slow moment of the machine hits everyone alike." },
  { title: "Against node:http", text: "Every number is requests per second next to a bare node:http server doing the same, as 100. The machine drops out of it." },
  { title: "No single scenario wins", text: "The score is the geometric mean over all twelve scenarios, so one great number cannot carry a server, nor one bad one sink it." },
  { title: "The median of rounds", text: `${run.rounds} rounds, ${run.seconds} seconds each after a warm-up, the median of them. On a ${run.machine}, with ${run.tool}.` },
];

export default function Benchmarks() {
  const inkan = by("inkan");
  const uws = by("inkan on uWebSockets.js");
  const express = by("Express");
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section className="pb-12 pt-16 lg:pt-24">
          <p className="font-mono text-sm text-hot">印 benchmarks</p>
          <h1 className="mt-3 max-w-3xl font-mono text-4xl font-extrabold leading-tight sm:text-5xl">Fast, and still every request checked.</h1>
          <p className="mt-5 max-w-2xl text-lg text-soft">
            Every inkan request below was validated against its contract, typed, given an id and trimmed to its response
            schema before it went out. These are the numbers with all of that switched on.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { value: uws.score.toFixed(1), label: "inkan on uWebSockets.js", note: `${times(uws.score, express.score)} Express, past bare node:http` },
              { value: inkan.score.toFixed(1), label: "inkan on node:http", note: `${times(inkan.score, express.score)} Express, with every check on` },
              { value: "100", label: "node:http, by hand", note: "the line everyone is measured against" },
            ].map((x, i) => (
              <div key={x.label} className={`rounded-2xl border p-6 ${i < 2 ? "border-hot/40 bg-seal/8" : "border-line bg-card/70"}`}>
                <p className={`font-mono text-5xl font-extrabold tabular-nums ${i < 2 ? "text-hot" : "text-ink"}`}>{x.value}</p>
                <p className="mt-3 font-mono text-sm font-bold">{x.label}</p>
                <p className="mt-1 text-sm text-soft">{x.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="font-mono text-2xl font-extrabold">Every scenario</h2>
          <p className="mt-3 max-w-2xl text-soft">
            Pick one and the servers sort themselves. {scenarios.length} of the twelve scenarios here, from a fixed answer to a body of 50
            objects checked one by one.
          </p>
          <div className="mt-8">
            <Board />
          </div>
        </section>

        <section className="py-16">
          <h2 className="font-mono text-2xl font-extrabold">How it is measured</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METHOD.map((m) => (
              <div key={m.title} className="rounded-2xl border border-line bg-card/70 p-5">
                <p className="font-mono text-sm font-bold">
                  <span className="text-hot">印</span> {m.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-soft">{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-mono text-2xl font-extrabold">A range, not a rank</h2>
            <p className="mt-4 text-soft">
              A run on another day moves each server by a few points, and inkan and Hono swap places within that. Fastify is
              still a little ahead on node:http, and closing that is what comes next. inkan also does a bit more per
              request than the others: an id for every request, and every key an answer&apos;s contract does not list kept
              back.
            </p>
            <p className="mt-4 text-soft">
              Your routes are not these routes. Measure the ones you have: the bench is a folder in the repository, and the
              same workflow runs it on GitHub for anyone.
            </p>
            <p className="mt-6 font-mono text-xs text-muted">
              this run: {run.date} · Node {run.node} · {run.machine} ·{" "}
              <a href={run.workflow} className="text-hot underline underline-offset-4">
                the workflow
              </a>
            </p>
          </div>
          <Code
            title="run it yourself"
            code={`git clone https://github.com/inkanjs/inkan
cd inkan/bench && npm install

# req/s, latency and memory, every server at once
node run.mjs node,fastify,hono,inkan,express 10 3

# what one request costs the server, in CPU time
node cpu.mjs node,fastify,hono,inkan`}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
