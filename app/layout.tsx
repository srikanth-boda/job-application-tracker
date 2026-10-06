import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Job Application Tracker", template: "%s | Job Application Tracker" },
  description: "One application = one source of truth.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
