// app/page.tsx
export const dynamic = "force-dynamic";

// import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
// import { Footer } from "@/components/Footer";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4">
        {/* <Header /> */}
        <Hero />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div id="how-it-works" className="mt-12 lg:mt-20 scroll-mt-20">
          <HowItWorks />
        </div>

        <div className="mt-12 lg:mt-20">
          <WhyChooseUs />
        </div>

        {/* <Footer /> */}
      </div>
    </div>
  );
}
