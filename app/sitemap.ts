// Every page a search engine should know: the landing pages, every docs page and the posts
// that are out. Drafts stay out until they are published.
import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";
import { published, source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    { url: absolute("/docs"), changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/hanko"), changeFrequency: "weekly", priority: 0.7 },
    { url: absolute("/benchmarks"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/community"), changeFrequency: "monthly", priority: 0.5 },
    { url: absolute("/blog"), changeFrequency: "weekly", priority: 0.6 },
  ];
  const docs: MetadataRoute.Sitemap = source
    .getPages()
    .filter((page) => page.url !== "/docs")
    .map((page) => ({ url: absolute(page.url), changeFrequency: "weekly", priority: 0.7 }));
  const posts: MetadataRoute.Sitemap = published().map((post) => ({
    url: absolute(post.url),
    lastModified: post.date,
    changeFrequency: "yearly",
    priority: 0.5,
  }));
  return [...pages, ...docs, ...posts];
}
