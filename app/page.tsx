import { connection } from "next/server";
import { Suspense } from "react";
import { direct } from "@inkanjs/next";
import { Footer, Nav } from "@/components/landing/chrome";
import { Hero } from "@/components/landing/hero";
import { Contract } from "@/components/landing/contract";
import { Playground } from "@/components/landing/playground";
import { Clips } from "@/components/landing/clips";
import { Bench, Integrations, Learn } from "@/components/landing/sections";
import { app } from "@/server/app";

/** A Server Component that asks the site's own API, in the same process, through direct(app). */
async function Shelf() {
  await connection(); // the shelf changes with every visitor: read it per request
  const res = await direct(app).get("/api/teas");
  const count = res.ok ? res.data.length : 0;
  return (
    <>
      <span className="text-ink">{count}</span> teas on the shelf right now
    </>
  );
}

export default function Home() {
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <p className="flex flex-wrap items-center gap-x-2 border-y border-line py-4 font-mono text-xs text-muted">
            <span className="text-hot">印</span>
            this page asked its own API through <code className="text-soft">direct(app)</code>, in the same process:
            <Suspense fallback={<span>asking…</span>}>
              <Shelf />
            </Suspense>
          </p>
        </div>
        <Contract />
        <Playground />
        <Clips />
        <Bench />
        <Integrations />
        <Learn />
      </main>
      <Footer />
    </div>
  );
}
