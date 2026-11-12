"use client";
// When the root layout itself fails: no providers, so no nav and no search.
import "./globals.css";
import { ProblemPage } from "@/components/problem-page";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="paper grain flex min-h-screen flex-col font-sans antialiased">
        <ProblemPage
          status={500}
          reason="Internal Server Error"
          headline="The whole site tripped."
          detail="Rendering {path} failed"
          extra={error.digest ? { digest: error.digest } : undefined}
          search={false}
          actions={
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-hot px-4 py-2.5 font-mono text-sm font-bold text-[#1a1614] transition hover:brightness-110"
            >
              Try again
            </button>
          }
        >
          <p>Something below every page failed. Trying again usually helps.</p>
        </ProblemPage>
      </body>
    </html>
  );
}
