import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { BestSellers } from "@/components/bestseller/BestSellers";
import { Discover } from "@/components/discover/Discover";
import { OurOrigins } from "@/components/story/OurOrigins";
import { BrandPanel } from "@/components/story/BrandPanel";
import { WhyNutyum } from "@/components/why-nutyum/WhyNutyum";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <BestSellers />
      <Discover />
      <OurOrigins />
      <BrandPanel />
      <WhyNutyum />
      <Newsletter />
      <Footer />
    </main>
  );
}
