"use client";
// MCP: the same contract, read by a model. A short scripted chat in a terminal window: the model
// calls a tool wrong, reads the 400 the contract wrote, and gets it right the second time.
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Window } from "@/components/code";

type Step =
  | { kind: "user"; text: string }
  | { kind: "model"; text: string }
  | { kind: "call"; tool: string; args: string; status: number; out: string };

const SCRIPT: Step[] = [
  { kind: "user", text: "Is Sencha still on the shelf?" },
  { kind: "call", tool: "getTeasById", args: '{ "id": "sencha" }', status: 400, out: "params.id: expected an integer" },
  { kind: "call", tool: "getTeas", args: '{ "kind": "green" }', status: 200, out: '[{ "id": 1, "name": "Sencha", "inStock": true }]' },
  { kind: "model", text: "Yes: Sencha (id 1) is in stock." },
];

const FACTS = [
  { glyph: "印", title: "Tools from contracts", text: "Name, description, input and output schema: all from the route you already wrote." },
  { glyph: "→", title: "A call is a request", text: "With the caller's credentials, through security, hooks and checks. No side door." },
  { glyph: "✓", title: "Proven by check", text: "inkan check --mcp runs every example again as a tool call." },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Agents() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin: "-20% 0px" });
  const still = useReducedMotion();
  const [shown, setShown] = useState(0);
  const steps = still ? SCRIPT.length : Math.min(shown, SCRIPT.length);

  // one step every 1.3 s while it is on screen, a pause at the end, then the chat starts over
  useEffect(() => {
    if (still || !seen) return;
    const t = setTimeout(() => setShown((n) => (n >= SCRIPT.length + 2 ? 0 : n + 1)), shown === 0 ? 500 : 1300);
    return () => clearTimeout(t);
  }, [shown, seen, still]);

  return (
    <section id="mcp" data-tone="agents" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="font-mono text-sm text-hot">印 new in 0.10 · for AI clients</p>
          <h2 className="mt-3 font-mono text-3xl font-extrabold leading-tight sm:text-4xl">Every route, a tool a model can call.</h2>
          <p className="mt-4 max-w-xl text-soft">
            Claude, Cursor and other AI clients call tools over MCP. A tool is a name, a description and a schema: inkan already
            has all three, for every route. One option, and the model reads the same contract your docs and tests do, down to
            the 400 that tells it which field was wrong.
          </p>
          <motion.pre
            initial={still ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mt-6 inline-block max-w-full overflow-x-auto rounded-xl border border-line bg-card/80 px-4 py-3 font-mono text-sm"
          >
            inkan({"{"} title: <span className="text-hot">&quot;Tea Shop&quot;</span>, <b>mcp: true</b> {"}"})
          </motion.pre>
          <ul className="mt-8 grid gap-3">
            {FACTS.map((f, i) => (
              <motion.li
                key={f.title}
                initial={still ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 200, damping: 22 }}
                className="flex items-start gap-4"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-seal/10 font-mono text-sm font-bold text-hot">{f.glyph}</span>
                <span>
                  <span className="block font-mono text-sm font-bold">{f.title}</span>
                  <span className="block text-sm text-soft">{f.text}</span>
                </span>
              </motion.li>
            ))}
          </ul>
          <Link href="/docs/mcp" className="mt-8 inline-block font-mono text-sm text-hot hover:underline">
            how it works →
          </Link>
        </div>

        <motion.div
          initial={still ? false : { opacity: 0, y: 30, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="min-w-0"
        >
          <Window title="claude · tea-shop over mcp">
            <div className="flex min-h-[380px] flex-col gap-3 p-5 font-mono text-[13px]">
              <AnimatePresence initial={false}>
                {SCRIPT.slice(0, steps).map((s, i) => (
                  <motion.div
                    key={`${i}-${s.kind}`}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className={s.kind === "user" ? "self-end" : "self-start"}
                  >
                    <Bubble step={s} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {shown > 0 && shown < SCRIPT.length && !still && (
                <motion.span
                  key={`dots-${shown}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="self-start text-[#8a7d72]"
                >
                  ● ● ●
                </motion.span>
              )}
            </div>
          </Window>
        </motion.div>
      </div>
    </section>
  );
}

function Bubble({ step }: { step: Step }) {
  if (step.kind === "user") return <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-seal px-4 py-2 text-[#fbf1e6]">{step.text}</div>;
  if (step.kind === "model") return <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#3a312c] px-4 py-2">{step.text}</div>;
  const ok = step.status < 400;
  return (
    <div className="w-[min(440px,72vw)] overflow-hidden rounded-xl border border-[#4a3f38]">
      <div className="flex items-center gap-2 bg-[#342c28] px-3 py-1.5 text-xs">
        <span className="text-[#b897e0]">tool</span>
        <b>{step.tool}</b>
        <span className="truncate text-[#a3958a]">{step.args}</span>
      </div>
      <div className="flex items-start gap-2 px-3 py-2 text-xs">
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 400, damping: 15 }}
          className={`shrink-0 rounded px-1.5 font-bold ${ok ? "bg-[#79c08a]/20 text-[#79c08a]" : "bg-[#e65d3e]/20 text-[#e65d3e]"}`}
        >
          {step.status}
        </motion.span>
        <span className={`break-all ${ok ? "" : "text-[#e65d3e]"}`}>{step.out}</span>
      </div>
    </div>
  );
}
