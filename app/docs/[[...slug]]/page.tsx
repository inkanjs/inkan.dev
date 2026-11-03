import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import * as Twoslash from "fumadocs-twoslash/ui";
import { BenchTable, Side } from "@/components/mdx";
import { docsImage } from "@/lib/og";
import { pageMeta } from "@/lib/site";
import { source } from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, ...Twoslash, Side, BenchTable, a: createRelativeLink(source, page) }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  return pageMeta({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    type: "article",
    images: [docsImage(page.slugs)], // drawn for each page by app/og/docs
  });
}
