// Three short Remotion scenes for the landing page, played in a loop by the Remotion Player.
// Each is drawn frame by frame from useCurrentFrame, so they stay sharp at any size.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const C = { bg: "#221d1a", panel: "#2a2421", bar: "#312a26", ink: "#ece1cf", soft: "#cbbda8", muted: "#8a7d72", seal: "#c4381f", hot: "#e2583e", ok: "#79c08a", gold: "#e3b341" };
const mono = "var(--font-mono-face), ui-monospace, monospace";
const noLigatures = { fontVariantLigatures: "none" } as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function Panel({ x, y, w, h, title, children }: { x: number; y: number; w: number; h: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: C.panel, borderRadius: 18, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.35)" }}>
      <div style={{ height: 40, background: C.bar, display: "flex", alignItems: "center", padding: "0 18px", color: C.muted, fontSize: 16, fontFamily: mono }}>{title}</div>
      <div style={{ padding: "18px 22px", fontFamily: mono, fontSize: 21, lineHeight: 1.65, color: C.ink, whiteSpace: "pre" }}>{children}</div>
    </div>
  );
}

/** inkan seal: the schema on the left becomes plain code on the right, and the stamp checks they match. */
export function SealScene() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const schema = ["const Tea = t.object({", "  id: t.int(),", "  name: t.string().min(1),", "  grams: t.int().min(1),", "});"];
  const sealed = [
    "function check(v) {",
    "  if (typeof v !== \"object\") …",
    "  if (!Number.isInteger(v.id)) …",
    "  if (v.name.length < 1) …",
    "  if (v.grams < 1) …",
    "}",
  ];
  const stamp = spring({ frame: f - 92, fps, config: { damping: 11, stiffness: 140 } });
  const hash = Math.min(8, Math.max(0, Math.floor((f - 120) / 3)));
  return (
    <AbsoluteFill style={{ background: C.bg, ...noLigatures }}>
      <Panel x={50} y={60} w={540} h={320} title="src/app.ts">
        {schema.map((l, i) => (
          <div key={i} style={{ opacity: interpolate(f, [i * 5, i * 5 + 10], [0, 1], clamp) }}>{l}</div>
        ))}
      </Panel>
      {/* the arrow, drawn across */}
      <div style={{ position: "absolute", left: 612, top: 205, width: interpolate(f, [30, 55], [0, 96], clamp), height: 4, background: C.seal, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 608, top: 168, fontFamily: mono, fontSize: 16, color: C.hot, opacity: interpolate(f, [40, 55], [0, 1], clamp) }}>inkan seal</div>
      <Panel x={730} y={60} w={520} h={320} title="inkan.seal.js">
        {sealed.map((l, i) => (
          <div key={i} style={{ opacity: interpolate(f, [55 + i * 5, 65 + i * 5], [0, 1], clamp), color: i === 0 || i === 5 ? C.ink : C.soft }}>{l}</div>
        ))}
      </Panel>
      {/* the stamp: lands on the sealed code */}
      <div
        style={{
          position: "absolute", left: 1040, top: 318, padding: "8px 18px", borderRadius: 10, border: `4px solid ${C.seal}`, color: C.hot,
          fontFamily: mono, fontWeight: 800, fontSize: 26, transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`, opacity: Math.min(1, stamp * 1.5),
          background: "rgba(26,22,20,.85)",
        }}
      >
        印 SEALED
      </div>
      <div style={{ position: "absolute", left: 50, top: 420, fontFamily: mono, fontSize: 22, color: C.muted }}>
        hash of the live contract <span style={{ color: C.ink }}>{"9f3a7c21".slice(0, hash)}</span>
        <span style={{ color: hash === 8 ? C.ok : C.muted }}>{hash === 8 ? "  ✓ matches the stamp, so the sealed code runs" : ""}</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: 470, fontFamily: mono, fontSize: 20, color: C.muted, opacity: interpolate(f, [150, 165], [0, 1], clamp) }}>
        no eval, no new Function: a file you can read, and it falls back when the contract changes
      </div>
    </AbsoluteFill>
  );
}

/** Hooks: one request through onRequest, the contract, preHandler, the handler and onSend; a bad one bounces. */
export function HooksScene() {
  const f = useCurrentFrame();
  const steps = ["onRequest", "contract", "preHandler", "handler", "onSend", "onResponse"];
  const gap = 205;
  const x0 = 70;
  const good = f % 180;
  const bad = (f + 90) % 180;
  // the good request walks every step; the bad one stops at the contract and turns back as a 400
  const first = x0 + 75; // the middle of the first box
  const goodX = interpolate(good, [0, 150], [first - 90, first + gap * 5 + 90], clamp);
  const badX = bad < 55 ? interpolate(bad, [0, 55], [first - 90, first + gap], clamp) : interpolate(bad, [55, 110], [first + gap, first - 90], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: mono, ...noLigatures }}>
      {steps.map((s, i) => {
        const lit = Math.abs(goodX - (first + i * gap)) < 75;
        const stopped = bad >= 45 && bad < 75 && i === 1; // the contract, where the bad one bounces
        return (
          <div key={s} style={{ position: "absolute", left: x0 + i * gap, top: 180, width: 150, height: 90, borderRadius: 16, display: "grid", placeItems: "center", fontSize: 19, fontWeight: 700,
            color: lit || stopped ? "#fbf1e6" : C.soft, background: lit ? C.seal : stopped ? "#8a5a1a" : C.panel, boxShadow: lit ? "0 0 0 6px rgba(196,56,31,.25)" : stopped ? "0 0 0 6px rgba(227,179,65,.25)" : "0 10px 30px rgba(0,0,0,.3)" }}>
            {s}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: x0, top: 224, width: gap * 5 + 150, height: 2, background: C.bar, zIndex: -1 }} />
      <div style={{ position: "absolute", left: goodX, top: 120, transform: "translateX(-50%)", whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 999, background: C.ok, color: "#15110f", fontSize: 17, fontWeight: 800 }}>GET /teas/1</div>
      <div style={{ position: "absolute", left: badX, top: 310, transform: "translateX(-50%)", whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 999, background: bad < 55 ? C.gold : C.hot, color: "#15110f", fontSize: 17, fontWeight: 800 }}>
        {bad < 55 ? "GET /teas/abc" : "400 · id: expected an integer"}
      </div>
      <div style={{ position: "absolute", left: x0, top: 420, fontSize: 21, color: C.muted }}>
        hooks reach the routes of their scope; a route with none takes the fast path
      </div>
    </AbsoluteFill>
  );
}

/** Streams: the kettle sends events, and the client shows each one as it lands. */
export function StreamScene() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const temps = [60, 65, 70, 75, 80];
  const each = 24;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: mono, ...noLigatures }}>
      <Panel x={50} y={60} w={600} h={380} title="server: GET /kettle">
        <div style={{ color: C.soft }}>{"sse(async function* (signal) {"}</div>
        <div style={{ color: C.soft }}>{"  for (let c = 60; c <= 80; c += 5)"}</div>
        <div style={{ color: C.ink }}>{"    yield { event: \"temp\", data: { c } };"}</div>
        <div style={{ color: C.soft }}>{"  yield { event: \"done\" };"}</div>
        <div style={{ color: C.soft }}>{"})"}</div>
      </Panel>
      <Panel x={700} y={60} w={540} h={380} title="client: EventSource">
        {temps.map((c, i) => {
          const s = spring({ frame: f - 10 - i * each, fps, config: { damping: 14 } });
          return (
            <div key={c} style={{ opacity: s, transform: `translateY(${(1 - s) * -30}px)` }}>
              <span style={{ color: C.muted }}>event: </span>temp <span style={{ color: C.muted }}>data: </span>
              <span style={{ color: C.gold }}>{`{ "c": ${c} }`}</span>
            </div>
          );
        })}
        {(() => {
          const s = spring({ frame: f - 10 - temps.length * each, fps, config: { damping: 14 } });
          return <div style={{ opacity: s, color: C.ok }}>event: done ✓ the tea is ready</div>;
        })()}
      </Panel>
      {/* the packets, travelling across */}
      {temps.map((c, i) => {
        const t = f - i * each;
        const x = interpolate(t, [0, 12], [640, 700], clamp);
        return <div key={c} style={{ position: "absolute", left: x, top: 230, width: 14, height: 14, borderRadius: 7, background: C.hot, opacity: t >= 0 && t <= 12 ? 1 : 0 }} />;
      })}
      <div style={{ position: "absolute", left: 50, top: 470, fontSize: 20, color: C.muted }}>
        keep-alive while quiet, and the source stops the moment the client goes away
      </div>
    </AbsoluteFill>
  );
}
