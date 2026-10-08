// The numbers on /benchmarks: one run of the `bench` workflow in inkanjs/inkan, as its README
// shows them. Every value is requests per second against plain node:http = 100, so the
// machine drops out; the score is the geometric mean over every scenario of the run.
// A new run: change `run` and the values, nothing else on the page needs to move.

export const run = {
  date: "2026-10-07",
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

export const servers: Server[] = [
  { name: "inkan on uWebSockets.js", what: "@inkanjs/uws", ours: true, score: 133.5, values: { hello: 143, params: 143, body: 101, answer: 99, router: 145, notFound: 163, invalid: 121 } },
  { name: "node:http, by hand", what: "the baseline", base: true, score: 100, values: { hello: 100, params: 100, body: 100, answer: 100, router: 100, notFound: 100, invalid: 100 } },
  { name: "Fastify", what: "schemas, like inkan", score: 88.1, values: { hello: 95, params: 93, body: 91, answer: 79, router: 95, notFound: 100, invalid: 59 } },
  { name: "inkan", what: "on node:http", ours: true, score: 85.4, values: { hello: 89, params: 87, body: 79, answer: 85, router: 91, notFound: 106, invalid: 69 } },
  { name: "Hono", what: "checks by hand", score: 85.0, values: { hello: 93, params: 79, body: 90, answer: 103, router: 76, notFound: 86, invalid: 81 } },
  { name: "Express", what: "checks by hand", score: 40.6, values: { hello: 41, params: 44, body: 56, answer: 68, router: 19, notFound: 20, invalid: 43 } },
];
