import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <div className="flex flex-col text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4">
        <Hero />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div id="how-it-works" className="mt-12 lg:mt-20 scroll-mt-20">
          <HowItWorks />
        </div>

        <div className="mt-12 lg:mt-20">
          <WhyChooseUs />
        </div>
        <Footer />
      </div>
    </div>
  );
}
