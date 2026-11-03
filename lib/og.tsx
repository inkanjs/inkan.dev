// The link preview of a docs page or a post, drawn at build time in the look of
// app/opengraph-image.png: warm dark paper, cream ink, the seal, JetBrains Mono.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

const size = { width: 1200, height: 630 };

/** Where the card of a docs page lives (app/og/docs), for the metadata of the page. */
export const docsImage = (slugs: string[]) => `/og/docs/${[...slugs, "image.png"].join("/")}`;

const C = { bg: "#1a1614", deep: "#15110f", ink: "#ece1cf", soft: "#cbbda8", muted: "#8a7d72", line: "#3a312c", hot: "#e2583e" };

const seal = `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "public/logo.svg")).toString("base64")}`;
const host = new URL(SITE).host;

// Only the glyphs a card uses, straight from Google Fonts, as next/font does for the pages.
// Without a network the card still renders, in the font ImageResponse brings along.
async function font(weight: number, text: string): Promise<ArrayBuffer | undefined> {
  "use cache";
  cacheLife("max");
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}&text=${encodeURIComponent(text)}`, { signal: AbortSignal.timeout(8000) })).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return undefined;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return res.ok ? await res.arrayBuffer() : undefined;
  } catch {
    return undefined;
  }
}

type Card = { kicker: string; title: string; description: string; path: string };

export async function card({ kicker, title, description, path }: Card) {
  const text = description.length > 150 ? `${description.slice(0, 147).trimEnd()}…` : description;
  const footer = `${host}${path}`;
  const [bold, regular] = await Promise.all([font(800, `inkan${title}`), font(400, `${kicker}${text}${footer}`)]);
  const fonts = [
    ...(bold ? [{ name: "JetBrains Mono", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "JetBrains Mono", data: regular, weight: 400 as const, style: "normal" as const }] : []),
  ];
  const titleSize = title.length > 44 ? 56 : title.length > 26 ? 66 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: `radial-gradient(circle at 92% 0%, #3a2a22 0%, ${C.bg} 42%, ${C.deep} 100%)`,
          color: C.ink,
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={seal} width={64} height={64} alt="" />
          <span style={{ fontSize: 44, fontWeight: 800 }}>inkan</span>
          <span style={{ marginLeft: "auto", fontSize: 24, color: C.hot }}>{kicker}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto", paddingTop: 24 }}>
          <div style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>{title}</div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.45, color: C.soft, maxWidth: 1000 }}>{text}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", borderTop: `2px solid ${C.line}`, paddingTop: 24, fontSize: 22, color: C.muted }}>
          <span>{footer}</span>
          <span style={{ marginLeft: "auto", width: 14, height: 14, borderRadius: 4, background: C.hot }} />
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
