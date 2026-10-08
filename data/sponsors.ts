// Who sponsors inkan. Empty for now: /community shows the sponsors section only once there
// is someone in it. An entry: { name, url, logo (a path under public/), tier }.
export type Sponsor = { name: string; url: string; logo?: string; tier: "gold" | "silver" | "backer" };

export const sponsors: Sponsor[] = [];
