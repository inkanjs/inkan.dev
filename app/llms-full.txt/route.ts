// llms-full.txt: every docs page as Markdown, one after the other. Built once, at build
// time, from the same MDX the pages are made of.
import { absolute } from "@/lib/site";
import { source } from "@/lib/source";

export async function GET() {
  const pages = await Promise.all(
    source.getPages().map(async (page) => {
      const body = await page.data.getText("processed");
      return `# ${page.data.title} (${absolute(page.url)})\n\n> ${page.data.description}\n\n${body.trim()}\n`;
    }),
  );
  return new Response(pages.join("\n---\n\n"), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
