import { blog, docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

export const source = loader({ baseUrl: "/docs", source: docs.toFumadocsSource() });

// Drafts are there for a preview only: in `next dev`, or a build with BLOG_DRAFTS=1. On the
// live site a draft is in no list and its page is a 404.
export const showDrafts = process.env.NODE_ENV === "development" || process.env.BLOG_DRAFTS === "1";

export type Post = (typeof blog)[number] & { slug: string; url: string };

const all: Post[] = blog
  .map((post) => {
    const slug = post.info.path.replace(/\.mdx?$/, "");
    return Object.assign(post, { slug, url: `/blog/${slug}` });
  })
  .sort((a, b) => b.date.localeCompare(a.date));

/** The posts that are out, newest first: the blog index, the sitemap. */
export const published = (): Post[] => all.filter((post) => !post.draft);

/** What the blog shows: the published posts, and the drafts too in a preview. */
export const posts = (): Post[] => (showDrafts ? all : published());

export const getPost = (slug: string): Post | undefined => posts().find((post) => post.slug === slug);

/** A post's date as people read it: "3 November 2026". */
export const day = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
