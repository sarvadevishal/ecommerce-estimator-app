import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

// Responsive app shell: a fixed navy sidebar + scrollable content with a sticky
// top bar. On desktop it's a [sidebar | content] grid; below `lg` the sidebar
// collapses to a slim horizontal nav bar at the top.
export function AppShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[252px_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <TopBar title={title} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-7 sm:px-8 sm:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
