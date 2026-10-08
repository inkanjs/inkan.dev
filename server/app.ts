// The API this site runs on: an inkan app, served by Next.js through @inkanjs/next.
// The playground on the front page talks to it, and its own docs live at /api/docs.
// Everything sits in memory and resets with the process: it is a playground, not a shop.
import { inkan, problem, rateLimit, reply, routes, sse, t } from "@vxnsin/inkan";

const Tea = t.object({ id: t.int(), name: t.string(), grams: t.int(), brewed: t.date() }).named("Tea");
const NewTea = t.object({ name: t.string().trim().min(1).max(40), grams: t.int().min(1).max(1000) }).named("NewTea");

const first = () => [
  { id: 1, name: "Sencha", grams: 100, brewed: new Date("2026-10-06T07:30:00Z") },
  { id: 2, name: "Gyokuro", grams: 50, brewed: new Date("2026-10-07T08:15:00Z") },
  { id: 3, name: "Hojicha", grams: 200, brewed: new Date("2026-10-08T06:45:00Z") },
];
let teas = first();
let next = 4;
const KEEP = 30; // the playground is for everybody: the shelf never grows past this

const shop = routes()
  .get(
    "/teas",
    {
      summary: "Every tea on the shelf",
      tags: ["teas"],
      response: { 200: t.array(Tea) },
      examples: [{ name: "the shelf" }],
    },
    () => teas,
  )
  .get(
    "/teas/:id",
    {
      summary: "One tea",
      tags: ["teas"],
      params: t.object({ id: t.int().min(1) }),
      response: { 200: Tea, 404: t.problem() },
      examples: [
        { name: "a sencha", params: { id: 1 }, expect: { name: "Sencha" } },
        { name: "no such tea", params: { id: 999 }, status: 404 },
      ],
    },
    ({ params }) => {
      const tea = teas.find((x) => x.id === params.id);
      if (!tea) throw problem(404, "tea-not-found", `There is no tea ${params.id}`);
      return tea;
    },
  )
  .post(
    "/teas",
    {
      summary: "Put a tea on the shelf",
      tags: ["teas"],
      body: NewTea,
      response: { 201: Tea },
      examples: [
        { name: "a bancha", body: { name: "Bancha", grams: 80 } },
        { name: "no name", body: { name: "", grams: -5 }, status: 400 },
      ],
    },
    ({ body }) => {
      const tea = { id: next++, ...body, brewed: new Date() };
      teas = [...teas, tea].slice(-KEEP);
      return reply(201, tea, { location: `/api/teas/${tea.id}` });
    },
  )
  .post("/teas/reset", { summary: "Back to the three teas it started with", tags: ["teas"] }, () => {
    teas = first();
    next = 4;
    return { ok: true };
  })
  .get(
    "/kettle",
    {
      summary: "The kettle, as server-sent events: five readings, then done",
      tags: ["streams"],
      response: { 200: t.events({ temp: t.object({ celsius: t.int() }), done: t.object({ ready: t.boolean() }) }) },
    },
    () =>
      sse(async function* (signal) {
        for (let celsius = 60; celsius <= 80 && !signal.aborted; celsius += 5) {
          yield { event: "temp", data: { celsius } };
          await new Promise((r) => setTimeout(r, 400));
        }
        yield { event: "done", data: { ready: true } };
      }),
  );

export const app = inkan({
  title: "inkan.dev playground",
  version: "1.0.0",
  description: "The API behind the playground on inkan.dev. It runs in memory and resets with the server.",
  docs: "/api/docs",
  openapi: "/api/openapi.json",
  inspector: false,
  log: false,
})
  .register(rateLimit({ max: 120, window: 60_000 }))
  .mount("/api", shop);
