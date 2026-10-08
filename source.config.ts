// The docs: MDX files under content/docs, read by fumadocs-mdx into .source at build time.
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { transformerTwoslash } from "fumadocs-twoslash";
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs";
import { createTwoslasher } from "twoslash";

// What every snippet takes for granted: the inkan API, and an app to add routes to. It sits
// in front of each block and is cut away before the block is shown, so the names in it carry
// their real types without the page showing an import above every example.
const PRELUDE = `import { inkan, t, html, raw, problem, reply, sse, routes, route, plugin, cors, rateLimit, compress, serveStatic } from "@vxnsin/inkan";
const app = inkan();
// ---cut---
`;
const twoslash = createTwoslasher();
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";

export const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema },
  meta: { schema: metaSchema },
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
