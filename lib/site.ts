// Where the site lives, and the metadata every page builds from it. The address is written
// here and nowhere else: SITE_URL overrides it, so the move to the inkan.dev domain is one
// environment variable (or this one line), and every canonical URL, the sitemap, robots.txt
// and the link previews follow.
import type { Metadata } from "next";

export const SITE = (process.env.SITE_URL ?? "https://inkan-dev.vercel.app").replace(/\/+$/, "");

export const NAME = "inkan";

/** An absolute URL on the site, for the sitemap, robots.txt and llms.txt. */
export const absolute = (path: string) => SITE + (path.startsWith("/") ? path : `/${path}`);

type PageMeta = {
  title?: string;
  description: string;
  /** The page's own path, which becomes its canonical URL. */
  path: string;
  type?: "website" | "article";
  /** The page's own link preview; the site's card (app/opengraph-image.png) when left out. */
  images?: string[];
  publishedTime?: string;
  noindex?: boolean;
};

/**
 * The metadata of a page: title, description, its canonical URL, and the Open Graph and
 * Twitter cards. Next merges these shallowly, so a page that sets openGraph without the
 * rest would lose the site name: every page goes through here instead.
 */
export function pageMeta({ title, description, path, type = "website", images, publishedTime, noindex }: PageMeta): Metadata {
  const card = title ?? "inkan · an API framework for Node where the docs can't lie";
  // a page that sets openGraph replaces the whole openGraph of the layout, images too, so the
  // site card is named here. A file-based opengraph-image in the page's own segment still wins.
  const og = images ?? ["/opengraph-image.png"];
  const tw = images ?? ["/twitter-image.png"];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: card,
      description,
      url: path,
      siteName: NAME,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: og,
    },
    twitter: { card: "summary_large_image", title: card, description, images: tw },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
