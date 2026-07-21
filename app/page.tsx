import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import BestUIWork from "@/components/BestUIWork";
import WorkflowProcess from "@/components/WorkflowProcess";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonial from "@/components/Testimonial";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Pixiio, Design-Led Creative Agency for UI, Branding & Websites",
  },
  description:
    "Pixiio designs brands that lead and inspire. We deliver UI/UX design, branding, website design, and marketing assets for startups, SaaS, and growing businesses worldwide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pixiio, Design-Led Creative Agency for UI, Branding & Websites",
    description:
      "Pixiio designs brands that lead and inspire. We deliver UI/UX design, branding, website design, and marketing assets for startups, SaaS, and growing businesses worldwide.",
    url: "/",
  },
};

export default function Home() {
  return (
  <>
    <Header />
    <main id="main-content" className="overflow-x-clip">
      <Hero />
      <Ticker />
      <Services />
      <FeaturedWork />
      <BestUIWork />
      <WorkflowProcess />
      <WhyChooseUs />
      <Testimonial />
      <Pricing />
      <FAQ />
      <CTABanner />
    </main>
    <Footer />
  </>
  );
}
