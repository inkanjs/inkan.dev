// After `next build`: the standalone server serves public/ and .next/static only when they sit
// next to it, and Next does not copy them. Then the folder .next/standalone is the whole site,
// for `node .next/standalone/server.js` (PORT and HOSTNAME from the environment, as warden gives them).
import { cpSync, existsSync } from "node:fs";

const out = ".next/standalone";
if (process.env.VERCEL) process.exit(0); // Vercel serves the build itself
if (!existsSync(out)) throw new Error(`${out} is missing: is output: "standalone" set in next.config.ts?`);
cpSync("public", `${out}/public`, { recursive: true });
cpSync(".next/static", `${out}/.next/static`, { recursive: true });
console.log(`standalone: ${out} has public/ and .next/static, start it with npm start`);
