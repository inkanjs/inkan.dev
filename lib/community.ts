// What /community shows, from GitHub and npm, cached for hours: the people who wrote inkan,
// and a few numbers. Everything fails soft: a page without the numbers is better than no page.
import { cacheLife } from "next/cache";

const REPOS = ["inkanjs/inkan", "inkanjs/integrations"];
export const PACKAGES = ["@vxnsin/inkan", "@inkanjs/next", "@inkanjs/vite", "@inkanjs/query", "@inkanjs/uws"];

export type Contributor = { login: string; avatar: string; url: string; contributions: number; repos: string[] };

async function json<T>(url: string): Promise<T | undefined> {
  try {
    // a token (read-only, public repos) lifts GitHub's limit of 60 asks an hour per address
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = { accept: "application/vnd.github+json", "user-agent": "inkan.dev" };
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    return res.ok ? ((await res.json()) as T) : undefined;
  } catch {
    return undefined;
  }
}

type GhContributor = { login: string; avatar_url: string; html_url: string; contributions: number; type: string };

/** Everyone with a commit in one of the repositories, bots left out, most commits first. */
export async function contributors(): Promise<Contributor[]> {
  "use cache";
  cacheLife("hours");
  const people = new Map<string, Contributor>();
  for (const repo of REPOS) {
    const list = (await json<GhContributor[]>(`https://api.github.com/repos/${repo}/contributors?per_page=100`)) ?? [];
    for (const c of list) {
      if (c.type === "Bot" || c.login.endsWith("[bot]")) continue;
      const known = people.get(c.login);
      if (known) {
        known.contributions += c.contributions;
        known.repos.push(repo);
      } else people.set(c.login, { login: c.login, avatar: c.avatar_url, url: c.html_url, contributions: c.contributions, repos: [repo] });
    }
  }
  return [...people.values()].sort((a, b) => b.contributions - a.contributions);
}

/** Stars, releases and last week's downloads; a number that is not there is left out. */
export async function numbers() {
  "use cache";
  cacheLife("hours");
  const repo = await json<{ stargazers_count: number }>("https://api.github.com/repos/inkanjs/inkan");
  const releases = await json<unknown[]>("https://api.github.com/repos/inkanjs/inkan/releases?per_page=100");
  let downloads = 0;
  for (const p of PACKAGES) {
    const d = await json<{ downloads?: number }>(`https://api.npmjs.org/downloads/point/last-week/${p}`);
    downloads += d?.downloads ?? 0;
  }
  return { stars: repo?.stargazers_count ?? 0, releases: releases?.length ?? 0, downloads };
}
