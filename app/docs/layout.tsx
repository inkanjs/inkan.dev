import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { Seal } from "@/components/seal";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: (
          <span className="flex items-center gap-2 font-mono font-extrabold">
            <Seal className="size-6" /> inkan
          </span>
        ),
        url: "/",
      }}
      githubUrl="https://github.com/inkanjs/inkan"
      links={[{ text: "npm", url: "https://www.npmjs.com/package/@vxnsin/inkan", external: true }]}
    >
      {children}
    </DocsLayout>
  );
}
