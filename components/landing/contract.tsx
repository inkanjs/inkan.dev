"use client";
// One contract, and what comes out of it: the route on the left, and as it scrolls into
// view, six things fan out of it, each on a line drawn from the code.
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Code } from "@/components/code";

const ROUTE = `app.get("/teas/:id", {
  params: t.object({ id: t.int() }),
  response: { 200: Tea, 404: t.problem() },
  examples: [
    { name: "found", params: { id: 1 } },
    { name: "missing", params: { id: 99 }, status: 404 },
  ],
}, ({ params }) => findTea(params.id));`;

const OUT = [
  { title: "Validation", line: "GET /teas/abc → 400, naming the field", glyph: "✓" },
  { title: "Types", line: "params.id is a number in the handler", glyph: "{}" },
  { title: "Only the contract", line: "what is not in Tea never leaves the server", glyph: "⊘" },
  { title: "OpenAPI 3.1", line: "written from the same schemas", glyph: "≡" },
  { title: "Docs page", line: "/docs, with the examples to try", glyph: "◫" },
  { title: "Tests", line: "inkan check runs every example", glyph: "▶" },
];

export function Contract() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const still = useReducedMotion();
  const on = seen || still;

  return (
    <section id="contract" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-hot">印 one contract</p>
      <h2 className="mt-3 max-w-2xl font-mono text-3xl font-extrabold leading-tight sm:text-4xl">Write it once. Everything else follows.</h2>
      <p className="mt-4 max-w-2xl text-soft">
        Params, query, body, responses and a few examples, next to the handler. inkan reads them and does the rest, so the
        docs, the types and the tests are never three things that drift apart.
      </p>

      <div ref={ref} className="relative mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={still ? false : { opacity: 0, y: 30 }}
          animate={on ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Code title="src/app.ts" code={ROUTE} />
        </motion.div>

        <ul className="relative grid gap-3 lg:pl-10">
          {/* the line from the code to the spine, and the spine down the cards (wide screens only) */}
          <motion.span
            aria-hidden
            className="absolute -left-10 top-1/2 hidden h-0.5 w-14 origin-left bg-seal/70 lg:block"
            initial={still ? false : { scaleX: 0 }}
            animate={on ? { scaleX: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.35 }}
          />
          <motion.span
            aria-hidden
            className="absolute left-4 top-[calc(100%/12)] hidden h-[calc(100%*10/12)] w-0.5 origin-center bg-seal/70 lg:block"
            initial={still ? false : { scaleY: 0 }}
            animate={on ? { scaleY: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.45 }}
          />
          {OUT.map((o, i) => (
            <motion.li
              key={o.title}
              initial={still ? false : { opacity: 0, x: -30, scale: 0.96 }}
              animate={on ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.09, type: "spring", stiffness: 200, damping: 22 }}
              whileHover={{ x: 6, transition: { type: "spring", stiffness: 500, damping: 30 } }}
              className="relative flex items-center gap-4 rounded-xl border border-line bg-card/80 px-4 py-3 backdrop-blur"
            >
              {/* the tick from the spine to this card */}
              <motion.span
                aria-hidden
                className="absolute -left-6 top-1/2 hidden h-0.5 w-6 origin-left bg-seal/70 lg:block"
                initial={still ? false : { scaleX: 0 }}
                animate={on ? { scaleX: 1 } : {}}
                transition={{ delay: 0.75 + i * 0.07, duration: 0.25 }}
              />
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-seal/10 font-mono text-sm font-bold text-hot">{o.glyph}</span>
              <span>
                <span className="block font-mono text-sm font-bold">{o.title}</span>
                <span className="block text-sm text-soft">{o.line}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
