// /hanko as data, for `inkan hanko` in the terminal: the same list, links made absolute.
import { KINDS } from "@/data/hanko";
import { allHanko } from "@/lib/hanko";
import { SITE } from "@/lib/site";

export async function GET() {
  const plugins = (await allHanko()).map((h) => ({ ...h, href: new URL(h.href, SITE).href }));
  return Response.json(
    { kinds: KINDS, plugins },
    { headers: { "cache-control": "public, max-age=3600, s-maxage=3600", "access-control-allow-origin": "*" } },
  );
}
