// llms.txt: an index of the docs for language models, every page with its description.
// Built once, at build time.
import { llms } from "fumadocs-core/source/llms";
import { absolute } from "@/lib/site";
import { published, source } from "@/lib/source";

export async function GET() {
  const index = await llms(source).index();
  const blog = published().map((post) => `- [${post.title}](${absolute(post.url)}): ${post.description}`);
  const text = [
    index.replace(/\]\(\//g, `](${absolute("/")}`),
    "",
    `The whole of the docs as one Markdown file: ${absolute("/llms-full.txt")}`,
    ...(blog.length ? ["", "## Blog", "", ...blog] : []),
    "",
  ].join("\n");
  return new Response(text, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
