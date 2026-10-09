// What /hanko lists beyond data/hanko.ts: every package on npm with the keyword inkan-plugin.
// Asked once a day, not per request. Everything fails soft: if npm does not answer in time,
// the page is built from the static list alone and asks again within the hour.
import { cacheLife } from "next/cache";
import { hanko, hidden, type Hanko } from "@/data/hanko";

const SEARCH = "https://registry.npmjs.org/-/v1/search?text=keywords:inkan-plugin&size=250";
const DOWNLOADS = "https://api.npmjs.org/downloads/point/last-week/";
const TIMEOUT = 5000;

type NpmObject = {
  downloads?: { weekly?: number };
  package: {
    name: string;
    version?: string;
    description?: string;
    keywords?: string[];
    date?: string;
    links?: { npm?: string; homepage?: string; repository?: string };
    dependencies?: Record<string, string>;
  };
};

async function json<T>(url: string): Promise<T | undefined> {
  try {
    const res = await fetch(url, { headers: { accept: "application/json", "user-agent": "inkan.dev" }, signal: AbortSignal.timeout(TIMEOUT) });
    return res.ok ? ((await res.json()) as T) : undefined;
  } catch {
    return undefined;
  }
}

/** only plain https links make it onto the page: a package's metadata is anyone's to write */
function https(url: string | undefined) {
  if (!url) return undefined;
  const clean = url.replace(/^git\+/, "").replace(/^git:\/\//, "https://").replace(/\.git$/, "");
  try {
    return new URL(clean).protocol === "https:" ? clean : undefined;
  } catch {
    return undefined;
  }
}

const day = (iso: string | undefined) => {
  const d = iso ? new Date(iso) : undefined;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    : undefined;
};

/** Last week's downloads for the packages the search did not count: unscoped ones in one ask, scoped ones each. */
async function weekly(names: string[]): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  const plain = names.filter((n) => !n.startsWith("@"));
  const scoped = names.filter((n) => n.startsWith("@")).slice(0, 20);
  const asks: Promise<void>[] = [];
  for (let i = 0; i < plain.length; i += 128) {
    const batch = plain.slice(i, i + 128);
    asks.push(
      json<Record<string, { downloads?: number } | null> & { downloads?: number; package?: string }>(DOWNLOADS + batch.join(",")).then((r) => {
        if (!r) return;
        // one package answers flat, several answer keyed by name
        if (batch.length === 1) {
          if (typeof r.downloads === "number") out.set(batch[0], r.downloads);
        } else for (const n of batch) if (typeof r[n]?.downloads === "number") out.set(n, r[n]!.downloads!);
      }),
    );
  }
  for (const n of scoped)
    asks.push(json<{ downloads?: number }>(DOWNLOADS + n).then((r) => void (typeof r?.downloads === "number" && out.set(n, r.downloads))));
  await Promise.all(asks);
  return out;
}

/** The community packages on npm that data/hanko.ts does not list yet. */
export async function fromNpm(): Promise<Hanko[]> {
  "use cache";
  const found = await json<{ objects?: NpmObject[] }>(SEARCH);
  if (!found?.objects) {
    cacheLife("hours");
    return [];
  }
  cacheLife("days");

  const known = new Set([...hidden, ...hanko.flatMap((h) => [h.name, h.npm].filter(Boolean) as string[])]);
  const objects = found.objects.filter(({ package: p }) => {
    if (known.has(p.name) || p.name.startsWith("@inkanjs/") || p.name.startsWith("@vxnsin/")) return false;
    // the search matches loosely; the keyword itself has to be there
    return p.keywords?.some((k) => k.toLowerCase() === "inkan-plugin") ?? false;
  });

  const counts = await weekly(objects.filter((o) => typeof o.downloads?.weekly !== "number").map((o) => o.package.name));
  return objects.map(({ package: p, downloads }) => {
    const npm = https(p.links?.npm) ?? `https://www.npmjs.com/package/${p.name}`;
    const description = (p.description ?? "").trim();
    return {
      name: p.name,
      description: description ? (description.length > 160 ? `${description.slice(0, 157).trimEnd()}…` : description) : "No description on npm yet.",
      kind: "community",
      href: npm,
      npm: p.name,
      repo: https(p.links?.repository),
      tags: (p.keywords ?? []).filter((k) => !/^inkan(-plugin)?$/i.test(k)).slice(0, 6),
      version: p.version,
      published: day(p.date),
      weekly: downloads?.weekly ?? counts.get(p.name),
      deps: p.dependencies ? Object.keys(p.dependencies).length : undefined,
    } satisfies Hanko;
  });
}

/** The static list first, then whatever npm adds. */
export async function allHanko(): Promise<Hanko[]> {
  return [...hanko, ...(await fromNpm())];
}
