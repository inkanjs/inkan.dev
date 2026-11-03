// The link preview of a post: its title and description on the site's paper.
import { notFound } from "next/navigation";
import { card } from "@/lib/og";
import { getPost, posts } from "@/lib/source";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "inkan blog";

export function generateStaticParams() {
  return posts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return card({ kicker: `blog · ${post.date}`, title: post.title, description: post.description, path: post.url });
}
