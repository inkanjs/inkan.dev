// The numbers on /benchmarks: one run of the `bench` workflow in inkanjs/inkan, as its README
// shows them. Every value is requests per second against plain node:http = 100, so the
// machine drops out; the score is the geometric mean over every scenario of the run.
// A new run: change `run` and the values, nothing else on the page needs to move.

export const run = {
  date: "2026-10-08",
  machine: "GitHub Actions runner, 4 cores",
  tool: "autocannon",
  seconds: 10,
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

// inkan 0.6.0. Every server from one run of the release bench; inkan on uWebSockets.js from a
// run of its own the same day, against node:http in that run.
export const servers: Server[] = [
  { name: "inkan on uWebSockets.js", what: "@inkanjs/uws", ours: true, score: 134.4, values: { hello: 147, params: 148, body: 104, answer: 99, router: 149, notFound: 154, invalid: 115 } },
  { name: "node:http, by hand", what: "the baseline", base: true, score: 100, values: { hello: 100, params: 100, body: 100, answer: 100, router: 100, notFound: 100, invalid: 100 } },
  { name: "inkan", what: "on node:http", ours: true, score: 89.1, values: { hello: 97, params: 91, body: 81, answer: 77, router: 91, notFound: 95, invalid: 72 } },
  { name: "Fastify", what: "schemas, like inkan", score: 88.6, values: { hello: 93, params: 93, body: 90, answer: 73, router: 94, notFound: 91, invalid: 63 } },
  { name: "inkan, sealed", what: "inkan seal", ours: true, score: 86.6, values: { hello: 88, params: 87, body: 99, answer: 75, router: 88, notFound: 90, invalid: 71 } },
  { name: "Hono", what: "checks by hand", score: 84.9, values: { hello: 96, params: 78, body: 88, answer: 96, router: 75, notFound: 80, invalid: 82 } },
  { name: "Express", what: "checks by hand", score: 42.4, values: { hello: 45, params: 47, body: 61, answer: 66, router: 19, notFound: 19, invalid: 45 } },
];
