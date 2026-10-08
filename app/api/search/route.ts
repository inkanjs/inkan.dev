// The docs search. A static segment, so it wins against the inkan catch-all next to it.
import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

export const { GET } = createFromSource(source);
