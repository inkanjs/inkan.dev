// Everything is open to crawlers but the playground API and the request inspector; the
// sitemap sits on the same address as the site, wherever SITE puts it.
import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_inkan"] }],
    sitemap: absolute("/sitemap.xml"),
  };
}
