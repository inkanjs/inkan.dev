"use client";
// Real requests against the inkan app this site runs on (server/app.ts, under /api).
// Nothing is faked: the 400 is what the contract says, the stream is a real stream.
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { highlight, Window } from "@/components/code";

type Preset = { label: string; method: "GET" | "POST"; path: string; body?: string; stream?: boolean; note: string };
const PRESETS: Preset[] = [
  { label: "the shelf", method: "GET", path: "/api/teas", note: "Every tea, trimmed to the Tea schema." },
  { label: "one tea", method: "GET", path: "/api/teas/1", note: "params.id arrives as a number." },
  { label: "no such tea", method: "GET", path: "/api/teas/999", note: "A problem document, the shape every error has." },
  { label: "not a number", method: "GET", path: "/api/teas/abc", note: "The contract says id is an int: 400, naming the field." },
  { label: "add a tea", method: "POST", path: "/api/teas", body: '{ "name": "Bancha", "grams": 80 }', note: "201 with a location header." },
  { label: "break the body", method: "POST", path: "/api/teas", body: '{ "name": "", "grams": -5 }', note: "Both fields wrong: both named." },
  { label: "the kettle", method: "GET", path: "/api/kettle", stream: true, note: "Server-sent events, piece by piece." },
];

type Result = { id: number; method: string; path: string; status: number; ms: number; headers: [string, string][]; body: string };
const SHOW = ["content-type", "location", "x-ratelimit-remaining", "x-request-id"];

function Status({ code }: { code: number }) {
  const tone = code < 300 ? "bg-ok/15 text-ok" : code < 500 ? "bg-hot/15 text-hot" : "bg-hot text-white";
  return <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${tone}`}>{code}</span>;
}

export function Playground() {
  const [preset, setPreset] = useState(0);
  const [body, setBody] = useState(PRESETS[0].body ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [log, setLog] = useState<Result[]>([]);
  const p = PRESETS[preset];

  async function send() {
    setBusy(true);
    const started = performance.now();
    const id = Date.now();
    try {
      const res = await fetch(p.path, {
        method: p.method,
        headers: p.body ? { "content-type": "application/json" } : undefined,
        body: p.method === "POST" ? body : undefined,
      });
      const headers = SHOW.flatMap((h) => (res.headers.get(h) ? [[h, res.headers.get(h)!] as [string, string]] : []));
      const base = { id, method: p.method, path: p.path, status: res.status, headers };
      if (p.stream && res.body) {
        // read the events as they come, and show each one the moment it lands
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let text = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += dec.decode(value);
          setResult({ ...base, ms: Math.round(performance.now() - started), body: text.trim() });
        }
      } else {
        const text = await res.text();
        let pretty = text;
        try {
          pretty = JSON.stringify(JSON.parse(text), null, 2);
        } catch {}
        setResult({ ...base, ms: Math.round(performance.now() - started), body: pretty });
      }
      setLog((l) => [{ ...base, ms: Math.round(performance.now() - started), body: "" }, ...l].slice(0, 6));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="playground" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-hot">印 live</p>
      <h2 className="mt-3 font-mono text-3xl font-extrabold sm:text-4xl">Talk to a real inkan app.</h2>
      <p className="mt-4 max-w-2xl text-soft">
        This site runs on inkan, through <code className="font-mono text-ink">@inkanjs/next</code>. Send it something, or
        break it on purpose. Its own docs are at{" "}
        {/* a route handler of the inkan app, not a Next.js page: a plain link, no client navigation */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/docs" className="text-hot underline underline-offset-4">
          /api/docs
        </a>
        .
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-2">
          {PRESETS.map((x, i) => (
            <button
              key={x.label}
              type="button"
              onClick={() => {
                setPreset(i);
                setBody(x.body ?? "");
              }}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                i === preset ? "border-hot bg-seal/10" : "border-line bg-card/60 hover:border-soft"
              }`}
            >
              <span className={`w-11 font-mono text-[11px] font-bold ${x.method === "GET" ? "text-ok" : "text-hot"}`}>{x.method}</span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-sm">{x.path}</span>
                <span className="block text-xs text-muted">{x.label}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Window title={`${p.method} ${p.path}`}>
            <div className="flex flex-col gap-3 p-4">
              <p className="text-sm text-[#cbbda8]">{p.note}</p>
              {p.method === "POST" && (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  spellCheck={false}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-sm text-term-ink outline-none focus:border-hot"
                  aria-label="Request body"
                />
              )}
              <button
                type="button"
                onClick={send}
                disabled={busy}
                className="self-start rounded-lg bg-seal px-4 py-2 font-mono text-sm font-bold text-[#fbf1e6] transition hover:brightness-110 disabled:opacity-60"
              >
                {busy ? "sending…" : "Send →"}
              </button>
            </div>
          </Window>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <Window title="response">
                  <div className="border-b border-white/5 px-4 py-3 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <Status code={result.status} />
                      <span className="text-[#8a7d72]">{result.ms} ms</span>
                    </div>
                    <div className="mt-2 grid gap-0.5">
                      {result.headers.map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-[#8a7d72]">{k}:</span> <span className="text-term-ink">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <pre className="max-h-80 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
                    <code>{highlight(result.body)}</code>
                  </pre>
                </Window>
              </motion.div>
            )}
          </AnimatePresence>

          {log.length > 0 && (
            <ul className="grid gap-1 font-mono text-xs text-muted">
              <AnimatePresence initial={false}>
                {log.map((r) => (
                  <motion.li
                    key={r.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <span className="w-10">{r.method}</span>
                    <span className="min-w-0 flex-1 truncate">{r.path}</span>
                    <Status code={r.status} />
                    <span className="w-14 text-right">{r.ms} ms</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
