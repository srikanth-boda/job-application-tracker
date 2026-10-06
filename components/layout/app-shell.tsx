import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail: string | null;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFD]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar fallbackEmail={userEmail} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

