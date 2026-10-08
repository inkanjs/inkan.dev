"use client";
// The contributors, one card each: they come in one after another, and lift a little on hover.
import { motion, useReducedMotion } from "motion/react";
import type { Contributor } from "@/lib/community";

export function People({ people }: { people: Contributor[] }) {
  const still = useReducedMotion();
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {people.map((p, i) => (
        <motion.li
          key={p.login}
          initial={still ? false : { opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 220, damping: 22 }}
          whileHover={still ? undefined : { y: -4, transition: { type: "spring", stiffness: 500, damping: 30 } }}
        >
          <a href={p.url} className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-card/70 p-5 text-center transition hover:border-hot">
            {/* eslint-disable-next-line @next/next/no-img-element -- GitHub's avatars, already sized by the URL */}
            <img src={`${p.avatar}&s=160`} alt="" width={80} height={80} loading="lazy" className="size-20 rounded-full ring-2 ring-line transition group-hover:ring-hot" />
            <span>
              <span className="block font-mono text-sm font-bold">{p.login}</span>
              <span className="block text-xs text-muted">
                {p.contributions} commit{p.contributions === 1 ? "" : "s"}
                {p.repos.length > 1 ? ` · ${p.repos.length} repos` : ""}
              </span>
            </span>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
