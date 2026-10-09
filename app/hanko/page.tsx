import type { Metadata } from "next";
import Link from "next/link";
import { Code } from "@/components/code";
import { Catalog } from "@/components/hanko/catalog";
import { Footer, Nav } from "@/components/landing/chrome";
import { Smooth } from "@/components/landing/smooth";

export const metadata: Metadata = {
  title: "Hanko",
  description: "Everything that stamps onto inkan: what is in the core, the official middleware, the integrations and community plugins.",
};

const ENTRY = `// data/hanko.ts, in inkanjs/inkan.dev
{
  name: "inkan-tenant",
  description: "One line: what it does.",
  kind: "community",
  href: "https://github.com/you/inkan-tenant#readme",
  npm: "inkan-tenant",
  repo: "https://github.com/you/inkan-tenant",
  tags: ["multi-tenant", "headers"],
}`;

export default function HankoPage() {
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Smooth />
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section className="pb-10 pt-16 lg:pt-24">
          <p className="font-mono text-sm text-hot">印 hanko</p>
          <h1 className="mt-3 flex flex-wrap items-baseline gap-x-4 font-mono text-4xl font-extrabold leading-tight sm:text-5xl">
            Hanko
            <span lang="ja" className="text-2xl font-normal text-muted sm:text-3xl">
              判子
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-soft">
            Everything that stamps onto an inkan app: what comes in the core, the official middleware, the integrations, and
            the plugins other people publish.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            The <em>inkan</em> is the seal. A <em>hanko</em> is the everyday word for the stamp you press it with.
          </p>
        </section>

        <section className="pb-12">
          <Catalog />
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-mono text-2xl font-extrabold">Stamp your own</h2>
            <p className="mt-4 text-soft">
              A plugin is a function that gets a scope and its options. Publish it on npm as{" "}
              <code className="whitespace-nowrap font-mono text-ink">inkan-&lt;name&gt;</code> with the keyword{" "}
              <code className="font-mono text-ink">inkan-plugin</code>, then add one entry to this list in a pull request.
            </p>
            <p className="mt-4 text-soft">
              Community entries are looked over before they are listed, not maintained by inkan: the README, the issues and
              the releases stay with their authors.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
              <Link href="/docs/plugins" className="text-hot underline underline-offset-4">
                writing a plugin →
              </Link>
              <Link href="/docs/publish-a-plugin" className="text-hot underline underline-offset-4">
                publish a plugin →
              </Link>
            </div>
          </div>
          <Code title="one entry, one pull request" code={ENTRY} className="min-w-0" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
