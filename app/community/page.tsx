import type { Metadata } from "next";
import { Suspense } from "react";
import { People } from "@/components/community/people";
import { Footer, Nav } from "@/components/landing/chrome";
import { contributors, numbers, PACKAGES } from "@/lib/community";
import { sponsors } from "@/data/sponsors";

export const metadata: Metadata = {
  title: "Community",
  description: "The people who build inkan, and how to join them.",
};

async function Numbers() {
  const [n, people] = await Promise.all([numbers(), contributors()]);
  const items = [
    { value: people.length, label: people.length === 1 ? "contributor" : "contributors" },
    { value: n.releases, label: "releases" },
    { value: PACKAGES.length, label: "packages" },
    ...(n.downloads > 0 ? [{ value: n.downloads, label: "downloads last week" }] : []),
    ...(n.stars > 0 ? [{ value: n.stars, label: "stars" }] : []),
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((x) => (
        <div key={x.label} className="rounded-2xl border border-line bg-card/70 p-5">
          <p className="font-mono text-3xl font-extrabold tabular-nums text-hot">{x.value.toLocaleString("en")}</p>
          <p className="mt-1 text-sm text-soft">{x.label}</p>
        </div>
      ))}
      {n.stars === 0 && (
        <a href="https://github.com/inkanjs/inkan" className="grid place-items-center rounded-2xl border border-dashed border-hot/50 p-5 text-center font-mono text-sm text-hot transition hover:bg-seal/10">
          ★ star it on GitHub
        </a>
      )}
    </div>
  );
}

async function Contributors() {
  const people = await contributors();
  if (people.length === 0) return <p className="text-soft">GitHub did not answer just now. They are all on the repository&apos;s contributors page.</p>;
  return <People people={people} />;
}

const JOIN = [
  { title: "Found a bug?", text: "Open an issue with the smallest app that shows it. A route and a request is usually enough.", href: "https://github.com/inkanjs/inkan/issues/new", cta: "open an issue" },
  { title: "Want a feature?", text: "Say what you are building and where inkan gets in the way. Real cases shape it best.", href: "https://github.com/inkanjs/inkan/issues", cta: "see the issues" },
  { title: "Your framework is missing?", text: "Integrations live in one repository, each a small package. A recipe for app.fetch is a start too.", href: "https://github.com/inkanjs/integrations", cta: "inkanjs/integrations" },
  { title: "Faster?", text: "The bench is in the repository and runs on GitHub. Bring a number and the change that made it.", href: "/benchmarks", cta: "the benchmarks" },
];

export default function Community() {
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section className="pb-12 pt-16 lg:pt-24">
          <p className="font-mono text-sm text-hot">印 community</p>
          <h1 className="mt-3 max-w-3xl font-mono text-4xl font-extrabold leading-tight sm:text-5xl">Built in the open.</h1>
          <p className="mt-5 max-w-2xl text-lg text-soft">
            inkan is MIT licensed and written in public, one pull request at a time. These are the people who did it, and the
            ways in if you want to be one of them.
          </p>
          <div className="mt-10">
            <Suspense fallback={<div className="h-28 animate-pulse rounded-2xl bg-card/60" />}>
              <Numbers />
            </Suspense>
          </div>
        </section>

        <section className="py-12">
          <h2 className="font-mono text-2xl font-extrabold">Contributors</h2>
          <p className="mt-3 text-soft">Everyone with a commit in inkan or its integrations. Thank you.</p>
          <div className="mt-8">
            <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-card/60" />}>
              <Contributors />
            </Suspense>
          </div>
        </section>

        <section className="py-12">
          <h2 className="font-mono text-2xl font-extrabold">Join in</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {JOIN.map((j) => (
              <a key={j.title} href={j.href} className="group rounded-2xl border border-line bg-card/70 p-6 transition hover:-translate-y-0.5 hover:border-hot">
                <p className="font-mono text-base font-bold">{j.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-soft">{j.text}</p>
                <p className="mt-4 font-mono text-sm text-hot">{j.cta} →</p>
              </a>
            ))}
          </div>
        </section>

        {/* only once there is someone to thank */}
        {sponsors.length > 0 && (
          <section className="py-12">
            <h2 className="font-mono text-2xl font-extrabold">Sponsors</h2>
            <p className="mt-3 text-soft">They keep inkan going.</p>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {sponsors.map((s) => (
                <li key={s.name}>
                  <a href={s.url} className={`grid h-24 place-items-center rounded-2xl border bg-card/70 p-4 font-mono text-sm transition hover:border-hot ${s.tier === "gold" ? "border-hot/50" : "border-line"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- a logo under public/, any size */}
                    {s.logo ? <img src={s.logo} alt={s.name} className="max-h-12 w-auto" /> : s.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
