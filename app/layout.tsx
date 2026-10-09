import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

const sans = Geist({ variable: "--font-sans-face", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono-face", subsets: ["latin"], weight: ["400", "500", "700", "800"] });

// where the site lives: the Vercel address until the inkan.dev domain is there
const SITE = process.env.SITE_URL ?? "https://inkan-dev.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "inkan · an API framework for Node where the docs can't lie", template: "%s · inkan" },
  description:
    "One contract per route gives you validation, types, OpenAPI, docs and tests. Runs on node:http, Bun, Deno and serverless, with no dependencies.",
  icons: { icon: "/logo.svg" },
  openGraph: { title: "inkan", description: "An API framework for Node where the docs can't lie.", url: SITE, siteName: "inkan" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider theme={{ defaultTheme: "dark" }}>{children}</RootProvider>
      </body>
    </html>
  );
}
