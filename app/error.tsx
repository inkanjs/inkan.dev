"use client";
import { useEffect } from "react";
import { Footer, Nav } from "@/components/landing/chrome";
import { ProblemPage } from "@/components/problem-page";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Nav />
      <ProblemPage
        status={500}
        reason="Internal Server Error"
        headline="This page broke while it was built."
        detail="Rendering {path} failed"
        extra={error.digest ? { digest: error.digest } : undefined}
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
        <p>
          Not your fault. Trying again often helps; if it keeps happening, an{" "}
          <a href="https://github.com/inkanjs/inkan.dev/issues" className="text-hot underline-offset-4 hover:underline">
            issue
          </a>{" "}
          with the address and the digest on the right lets me find it.
        </p>
      </ProblemPage>
      <Footer />
    </div>
  );
}
