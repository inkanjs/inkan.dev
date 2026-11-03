import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import * as Twoslash from "fumadocs-twoslash/ui";
import { Footer, Nav } from "@/components/landing/chrome";
import { Smooth } from "@/components/landing/smooth";
import { pageMeta } from "@/lib/site";
import { day, getPost, posts } from "@/lib/source";

export function generateStaticParams() {
  return posts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();
  return pageMeta({
    title: post.title,
    description: post.description,
    path: post.url,
    type: "article",
    publishedTime: post.date,
    images: [`${post.url}/opengraph-image`], // drawn for each post, next to this page
    noindex: post.draft,
  });
}

export default async function Post(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();
  const MDX = post.body;
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Smooth />
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 sm:px-8">
        <header className="pb-8 pt-16 lg:pt-24">
          <Link href="/blog" className="font-mono text-sm text-hot hover:underline">
            ← blog
          </Link>
          {post.draft && (
            <p className="mt-6 rounded-xl border border-hot/60 bg-seal/8 px-4 py-3 font-mono text-sm text-hot">
              Draft, not published. This page is only built for a preview and is not in the blog index or the sitemap.
            </p>
          )}
          <h1 className="mt-6 font-mono text-3xl font-extrabold leading-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-soft">{post.description}</p>
          <p className="mt-4 font-mono text-xs text-muted">
            {day(post.date)} · {post.author}
          </p>
        </header>
        <article className="prose max-w-none pb-16">
          <MDX components={{ ...defaultMdxComponents, ...Twoslash }} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
