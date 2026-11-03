// The numbers on /benchmarks: one run of the `bench` workflow in inkanjs/inkan, as its README
// shows them. Every value is requests per second against plain node:http = 100, so the
// machine drops out; the score is the geometric mean over every scenario of the run.
// A new run: change `run` and the values, nothing else on the page needs to move.

export const run = {
  date: "2026-11-03",
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

// inkan 0.9.0: the median of three runs of the release bench, every server in each run;
// inkan on uWebSockets.js still from its own run with 0.6.0, against node:http in that run.
export const servers: Server[] = [
  { name: "inkan on uWebSockets.js", what: "@inkanjs/uws, measured with 0.6.0", ours: true, score: 134.4, values: { hello: 147, params: 148, body: 104, answer: 99, router: 149, notFound: 154, invalid: 115 } },
  { name: "node:http, by hand", what: "the baseline", base: true, score: 100, values: { hello: 100, params: 100, body: 100, answer: 100, router: 100, notFound: 100, invalid: 100 } },
  { name: "inkan", what: "on node:http", ours: true, score: 89.4, values: { hello: 94, params: 89, body: 86, answer: 90, router: 89, notFound: 93, invalid: 74 } },
  { name: "inkan, sealed", what: "inkan seal", ours: true, score: 88.3, values: { hello: 85, params: 92, body: 98, answer: 88, router: 89, notFound: 88, invalid: 76 } },
  { name: "Fastify", what: "schemas, like inkan", score: 87.2, values: { hello: 88, params: 91, body: 91, answer: 76, router: 90, notFound: 87, invalid: 59 } },
  { name: "Hono", what: "checks by hand", score: 82.5, values: { hello: 84, params: 71, body: 94, answer: 99, router: 71, notFound: 74, invalid: 84 } },
  { name: "Express", what: "checks by hand", score: 46.1, values: { hello: 44, params: 46, body: 71, answer: 72, router: 23, notFound: 22, invalid: 50 } },
];
