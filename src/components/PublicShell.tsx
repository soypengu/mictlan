"use client";

import { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

