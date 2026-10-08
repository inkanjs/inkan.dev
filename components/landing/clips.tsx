"use client";
// The three Remotion scenes, in tabs. The Player draws them in the page, frame by frame:
// no video file, sharp at every size, and they only play while they are on screen.
import { Player, type PlayerRef } from "@remotion/player";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HooksScene, SealScene, StreamScene } from "@/components/clips/scenes";
import { useInBrowser } from "@/lib/client-only";

const CLIPS = [
  { key: "seal", once: true, label: "inkan seal", title: "Contracts as plain code", text: "inkan seal compiles your schemas to a file you can read. A hash ties it to the live contract, so a change falls back instead of lying.", component: SealScene, frames: 200 },
  { key: "hooks", label: "hooks", title: "Every request, the same way", text: "onRequest, the contract, preHandler, the handler, onSend, onResponse. A request that breaks the contract never reaches you.", component: HooksScene, frames: 180 },
  { key: "streams", label: "streams", title: "Streams with a contract too", text: "Server-sent events are checked event by event, kept alive while quiet, and stopped when the client leaves.", component: StreamScene, frames: 170 },
];

export function Clips() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  // a state, not a ref: the effect below has to run again once the Player is there
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  // whether the clip on screen has played to its end; a new tab starts it over
  const [ended, setEnded] = useState(false);
  const seen = useInView(ref, { margin: "-15% 0px" });
  const still = useReducedMotion();
  const clip = CLIPS[active];
  // the Player reads the clock while it renders: only in the browser, never while the page is prerendered
  const mounted = useInBrowser();

  useEffect(() => {
    if (!player) return;
    const onEnded = () => setEnded(true);
    player.addEventListener("ended", onEnded);
    return () => player.removeEventListener("ended", onEnded);
  }, [player]);

  useEffect(() => {
    if (!player) return;
    // a clip that has played to its end stays there; only switching back to it plays it again
    if (seen && !still && !ended) player.play();
    else player.pause();
  }, [player, seen, still, ended]);

  return (
    <section id="clips" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-hot">印 under the hood</p>
      <h2 className="mt-3 font-mono text-3xl font-extrabold sm:text-4xl">Fast, and still honest.</h2>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
        {CLIPS.map((c, i) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={i === active}
            type="button"
            onClick={() => {
              setActive(i);
              setEnded(false); // switching tabs plays the clip from its start
            }}
            className={`relative rounded-full px-4 py-2 font-mono text-sm transition ${i === active ? "text-[#fbf1e6]" : "text-soft hover:text-ink"}`}
          >
            {i === active && <motion.span layoutId="clip-tab" className="absolute inset-0 rounded-full bg-seal" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="relative">{c.label}</span>
          </button>
        ))}
      </div>

      <div ref={ref} className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_2fr]">
        <motion.div key={clip.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h3 className="font-mono text-xl font-bold">{clip.title}</h3>
          <p className="mt-3 text-soft">{clip.text}</p>
        </motion.div>
        <div className="overflow-hidden rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,.35)] ring-1 ring-white/5">
          {!mounted ? (
            <div className="w-full bg-[#221d1a]" style={{ aspectRatio: "1300 / 540" }} />
          ) : (
          <Player
            key={clip.key}
            ref={setPlayer}
            component={clip.component}
            durationInFrames={clip.frames}
            fps={30}
            compositionWidth={1300}
            compositionHeight={540}
            loop={!("once" in clip && clip.once)}
            initiallyMuted
            controls={false}
            clickToPlay={false}
            style={{ width: "100%", aspectRatio: "1300 / 540" }}
            acknowledgeRemotionLicense
          />
          )}
        </div>
      </div>
    </section>
  );
}
