import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { TheProblemSection } from "@/components/landing/the-problem-section";
import { WhatYouCanManageSection } from "@/components/landing/what-you-can-manage-section";
import { ProductPreviewSection } from "@/components/landing/product-preview-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CtaBannerSection } from "@/components/landing/cta-banner-section";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "JobTrack | Track Every Job Application. Stay on Top of Your Job Search.",
  description:
    "One application = one source of truth. Keep your applications, resumes, interviews, and follow-ups organized in one place.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Header />
      <main id="main-content">
        <HeroSection />
        <TheProblemSection />
        <WhatYouCanManageSection />
        <ProductPreviewSection />
        <HowItWorksSection />
        <CtaBannerSection />
      </main>
      <Footer />
    </div>
  );
}
