import type { Metadata } from "next";
import { Footer, Nav } from "@/components/landing/chrome";
import { ProblemPage } from "@/components/problem-page";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="paper grain flex min-h-screen flex-col">
      <Nav />
      <ProblemPage status={404} reason="Not Found" headline="No route for this one." detail="No page matches GET {path}">
        <p>
          This address is not in the contract. It may have moved when the docs were reordered, or it never existed. The search
          usually finds what it was meant to be.
        </p>
      </ProblemPage>
      <Footer />
    </div>
  );
}
