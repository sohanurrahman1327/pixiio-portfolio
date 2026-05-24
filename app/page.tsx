import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import BestUIWork from "@/components/BestUIWork";
import DesignProcess from "@/components/DesignProcess";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonial from "@/components/Testimonial";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
  <>
    <Header />
    <main>
      <Hero />
      <Ticker />
      <Services />
      <Ticker />
      <FeaturedWork />
      <Ticker />
      <BestUIWork />
      <DesignProcess />
      <WhyChooseUs />
      <Ticker />
      <Testimonial />
      <Pricing />
      <FAQ />
      <CTABanner />
    </main>
    <Footer />
  </>
  );
}
