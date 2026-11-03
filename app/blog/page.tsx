import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Nav } from "@/components/landing/chrome";
import { Smooth } from "@/components/landing/smooth";
import { pageMeta } from "@/lib/site";
import { day, posts } from "@/lib/source";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description: "Releases, and notes on how inkan works and why, from the person who writes it.",
  path: "/blog",
});

export default function Blog() {
  const list = posts();
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Smooth />
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 sm:px-8">
        <section className="pb-10 pt-16 lg:pt-24">
          <p className="font-mono text-sm text-hot">印 blog</p>
          <h1 className="mt-3 font-mono text-4xl font-extrabold leading-tight sm:text-5xl">Notes from the workshop.</h1>
          <p className="mt-5 text-lg text-soft">Releases, and how inkan works and why. Written by Vensin, who builds it.</p>
        </section>
        <ul className="grid gap-4 pb-16">
          {list.map((post) => (
            <li key={post.slug}>
              <Link href={post.url} className="block rounded-2xl border border-line bg-card/70 p-6 transition hover:border-hot/60">
                <p className="font-mono text-xs text-muted">
                  {day(post.date)}
                  {post.draft && <span className="ml-3 rounded border border-hot/60 px-1.5 py-0.5 text-hot">draft, not published</span>}
                </p>
                <h2 className="mt-2 font-mono text-xl font-extrabold">{post.title}</h2>
                <p className="mt-2 text-soft">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
