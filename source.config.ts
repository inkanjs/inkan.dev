// The docs: MDX files under content/docs, read by fumadocs-mdx into .source at build time.
import { defineCollections, defineConfig, defineDocs } from "fumadocs-mdx/config";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import { createTwoslasher } from "twoslash";

// What every snippet takes for granted: the inkan API, and an app to add routes to. It sits
// in front of each block and is cut away before the block is shown, so the names in it carry
// their real types without the page showing an import above every example.
const PRELUDE = `import { inkan, t, html, raw, problem, reply, sse, routes, route, plugin, cors, rateLimit, compress, serveStatic } from "@inkanjs/inkan";
const app = inkan();
// ---cut---
`;
const twoslash = createTwoslasher();
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { z } from "zod";

// Every page has to say what it is about: the description is the line under the title, the
// text of the link preview, the entry in llms.txt and what a search engine shows. A page
// without one fails the build, with the file named.
const description = z.string({ error: "every page needs a description in its frontmatter" }).trim().min(20, "the description is too short to say what the page is about");

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({ description }),
    // the page as plain Markdown, for llms-full.txt
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: { schema: metaSchema },
});

// The blog: one MDX file per post under content/blog. A post with draft: true is built only
// for a preview (BLOG_DRAFTS=1 or next dev); it is not listed, not in the sitemap, and
// answers 404 on the live site until the flag goes.
export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: pageSchema.extend({
    description,
    date: z.iso.date(),
    author: z.string().default("Vensin"),
    draft: z.boolean().default(false),
  }),
});

// Every TypeScript block gets Twoslash: hover a name and see its type, from the real inkan
// types. The snippets are parts of an app, not whole files, so names they do not define are
// not errors here; ```ts notwoslash leaves a block plain. Types are cached between builds.
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          explicitTrigger: false,
          throws: false,
          typesCache: createFileSystemTypesCache(),
          twoslashOptions: { handbookOptions: { noErrors: true } },
          twoslasher: ((code: string, lang?: string, options?: object) => twoslash(PRELUDE + code, lang, options as never)) as never,
        }),
      ],
    },
  },
});
