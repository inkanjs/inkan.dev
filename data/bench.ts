// The numbers on /benchmarks: one run of the `bench` workflow in inkanjs/inkan, as its README
// shows them. Every value is requests per second against plain node:http = 100, so the
// machine drops out; the score is the geometric mean over every scenario of the run.
// A new run: change `run` and the values, nothing else on the page needs to move.

export const run = {
  date: "2026-11-13",
  machine: "GitHub Actions runner, 4 cores",
  tool: "autocannon",
  seconds: 15,
  rounds: 3,
  node: "24",
  workflow: "https://github.com/inkanjs/inkan/actions/workflows/bench.yml",
};

export const scenarios = [
  { key: "hello", label: "hello", detail: "a fixed answer, 100 connections" },
  { key: "params", label: "params + query", detail: "/users/42?fields=name, both read and typed" },
  { key: "body", label: "body of 50", detail: "a JSON body of 50 objects, every one checked" },
  { key: "answer", label: "answer of 100", detail: "100 objects out, each to its contract" },
  { key: "router", label: "400 routes", detail: "one route among 400 with params" },
  { key: "notFound", label: "404", detail: "a path nobody serves" },
  { key: "invalid", label: "400", detail: "a body that breaks the contract" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

export type Server = {
  name: string;
  /** What it is, in a few words. */
  what: string;
  ours?: boolean;
  base?: boolean;
  score: number;
  values: Record<ScenarioKey, number>;
};

// inkan 0.10.0: the median of three runs of the release bench, every server in each run;
// inkan sealed from the runs of 0.9.0, and inkan on uWebSockets.js from its own run with
// 0.6.0, each against node:http in its run.
export const servers: Server[] = [
  { name: "inkan on uWebSockets.js", what: "@inkanjs/uws, measured with 0.6.0", ours: true, score: 134.4, values: { hello: 147, params: 148, body: 104, answer: 99, router: 149, notFound: 154, invalid: 115 } },
  { name: "node:http, by hand", what: "the baseline", base: true, score: 100, values: { hello: 100, params: 100, body: 100, answer: 100, router: 100, notFound: 100, invalid: 100 } },
  { name: "inkan", what: "on node:http", ours: true, score: 89.8, values: { hello: 90, params: 93, body: 87, answer: 88, router: 91, notFound: 95, invalid: 81 } },
  { name: "inkan, sealed", what: "inkan seal, measured with 0.9.0", ours: true, score: 88.3, values: { hello: 85, params: 92, body: 98, answer: 88, router: 89, notFound: 88, invalid: 76 } },
  { name: "Fastify", what: "schemas, like inkan", score: 88.6, values: { hello: 92, params: 90, body: 93, answer: 80, router: 94, notFound: 92, invalid: 76 } },
  { name: "Hono", what: "checks by hand", score: 85.6, values: { hello: 94, params: 77, body: 93, answer: 98, router: 77, notFound: 85, invalid: 87 } },
  { name: "Express", what: "checks by hand", score: 48.9, values: { hello: 53, params: 52, body: 69, answer: 73, router: 23, notFound: 23, invalid: 53 } },
];

// One run with ten frameworks at once (bench/reports/frameworks-2026-11.md). Only the compare
// page shows it, next to the release numbers above, never mixed into them.
export const widerRun: { run: typeof run; servers: Server[] } = {
  run: { ...run, date: "2026-11-13" },
  servers: [
    { name: "node:http, by hand", what: "the baseline", base: true, score: 100, values: { hello: 100, params: 100, body: 100, answer: 100, router: 100, notFound: 100, invalid: 100 } },
    { name: "Fastify", what: "schemas, like inkan", score: 88.8, values: { hello: 88, params: 96, body: 95, answer: 80, router: 91, notFound: 83, invalid: 73 } },
    { name: "inkan", what: "on node:http", ours: true, score: 88.5, values: { hello: 89, params: 90, body: 89, answer: 88, router: 93, notFound: 88, invalid: 78 } },
    { name: "Hono", what: "checks by hand", score: 81.0, values: { hello: 85, params: 71, body: 88, answer: 97, router: 72, notFound: 71, invalid: 84 } },
    { name: "h3", what: "checks by hand", score: 75.8, values: { hello: 75, params: 72, body: 88, answer: 95, router: 72, notFound: 60, invalid: 80 } },
    { name: "Elysia", what: "on Node, its own schemas", score: 54.7, values: { hello: 76, params: 39, body: 41, answer: 93, router: 43, notFound: 59, invalid: 22 } },
    { name: "hapi", what: "checks by hand", score: 46.5, values: { hello: 45, params: 40, body: 52, answer: 76, router: 44, notFound: 45, invalid: 38 } },
    { name: "Express", what: "checks by hand", score: 40.1, values: { hello: 43, params: 39, body: 59, answer: 68, router: 18, notFound: 16, invalid: 43 } },
    { name: "NestJS", what: "on Express", score: 34.4, values: { hello: 36, params: 34, body: 54, answer: 63, router: 17, notFound: 14, invalid: 30 } },
    { name: "Koa", what: "with @koa/router", score: 25.2, values: { hello: 20, params: 20, body: 38, answer: 51, router: 22, notFound: 20, invalid: 24 } },
  ],
};
