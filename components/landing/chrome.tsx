"use client";
// The bar on top and the foot of the landing page.
import { motion, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Seal } from "@/components/seal";
import { useInBrowser } from "@/lib/client-only";

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "#playground", label: "Playground" },
  { href: "#integrations", label: "Integrations" },
  { href: "https://github.com/inkanjs/inkan", label: "GitHub" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const ready = useInBrowser(); // the theme is only known in the browser
  const dark = !ready || resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-lg border border-line text-soft transition hover:border-hot hover:text-ink"
      aria-label={dark ? "Light theme" : "Dark theme"}
    >
      <motion.span key={dark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="text-sm">
        {dark ? "☾" : "☀"}
      </motion.span>
    </button>
  );
}

export function Nav() {
  const { scrollY } = useScroll();
  const shade = useTransform(scrollY, [0, 80], [0, 1]);
  return (
    <header className="sticky top-0 z-50">
      <motion.div style={{ opacity: shade }} className="absolute inset-0 border-b border-line bg-bg/80 backdrop-blur-md" />
      <nav className="relative mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-mono text-lg font-extrabold">
          <Seal className="size-7" /> inkan
        </Link>
        <div className="ml-auto hidden items-center gap-6 font-mono text-sm text-soft md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-hot">
              {l.label}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link href="/docs" className="font-mono text-sm text-soft hover:text-hot md:hidden">
            Docs
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-mono text-lg font-extrabold">
            <Seal className="size-7" /> inkan
          </div>
          <p className="mt-3 max-w-xs text-sm text-soft">
            An <em>inkan</em> (印鑑) is the seal a Japanese contract gets stamped with. Here every route carries one.
          </p>
        </div>
        {[
          { title: "Learn", links: [["Docs", "/docs"], ["Installation", "/docs/installation"], ["Routes", "/docs/routes"], ["inkan learn", "#learn"]] },
          { title: "Packages", links: [["@vxnsin/inkan", "https://www.npmjs.com/package/@vxnsin/inkan"], ["@inkanjs/vite", "/docs/integrations/vite"], ["@inkanjs/next", "/docs/integrations/next"], ["@inkanjs/query", "/docs/integrations/query"]] },
          { title: "Project", links: [["GitHub", "https://github.com/inkanjs/inkan"], ["Integrations", "https://github.com/inkanjs/integrations"], ["Changelog", "https://github.com/inkanjs/inkan/blob/main/CHANGELOG.md"], ["This API's docs", "/api/docs"]] },
        ].map((col) => (
          <div key={col.title}>
            <p className="font-mono text-sm font-bold">{col.title}</p>
            <ul className="mt-3 grid gap-2 text-sm text-soft">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition hover:text-hot">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="pb-10 text-center font-mono text-xs text-muted">MIT · made by Vensin · this site runs on inkan</p>
    </footer>
  );
}
