// The link preview of every docs page, drawn at build time: /og/docs/<slug>/image.png.
// It cannot be an opengraph-image file next to the page, because Next does not allow
// anything after the optional catch-all of /docs/[[...slug]].
import { notFound } from "next/navigation";
import { card } from "@/lib/og";
import { source } from "@/lib/source";

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: [...page.slugs, "image.png"] }));
}

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page || slug.at(-1) !== "image.png") notFound();
  const section = page.slugs.length > 1 ? `docs / ${page.slugs[0]}` : "docs";
  return card({ kicker: section, title: page.data.title, description: page.data.description, path: page.url });
}
