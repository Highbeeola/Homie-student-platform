// app/page.tsx
export const dynamic = "force-dynamic";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Footer } from "@/components/Footer"; // Import the new Footer

// Note: Link is no longer needed here unless you add other custom links
// import Link from "next/link";

export default async function HomePage() {
  // NO DATABASE CALLS on the homepage for a super-fast load!
  return (
    <div className="min-h-screen bg-[#001428] text-[#e6f9ff]">
      <div className="mx-auto max-w-6xl px-4">
        <Header />
        <Hero />
      </div>

      {/* Wrap other sections in a div for padding */}
      <div className="mx-auto max-w-6xl px-4">
        <div id="how-it-works" className="mt-12 lg:mt-20 scroll-mt-20">
          <HowItWorks />
        </div>

        <div className="mt-12 lg:mt-20">
          <WhyChooseUs />
        </div>

        {/* We can add the Testimonials section here later */}

        <Footer />
      </div>
    </div>
  );
}
