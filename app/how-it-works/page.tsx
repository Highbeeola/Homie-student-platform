import Link from "next/link";
import { Search, ShieldCheck, Home } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#041322] text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">How It Works</h1>
          <p className="text-xl text-gray-400">
            Finding your student accommodation has never been easier.
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Search size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Browse or List</h2>
              <p className="text-gray-300 leading-relaxed">
                Find verified listings using our search filters, or list your
                own space in just a few minutes. We verify student IDs to ensure
                the community stays safe.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">2. Connect Securely</h2>
              <p className="text-gray-300 leading-relaxed">
                Connect directly with fellow students or landlords via WhatsApp.
                Homie charges <strong>zero agent fees</strong> and no hidden
                commissions.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Home size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">3. Get Settled</h2>
              <p className="text-gray-300 leading-relaxed">
                Meet, inspect the place, finalize the arrangements, and move
                into your new student home. Don't forget to leave a review!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/browse"
            className="inline-block px-8 py-4 rounded-xl bg-[#00d4ff] text-[#041322] font-bold text-lg hover:opacity-90 transition-transform hover:scale-105"
          >
            Start Browsing Now
          </Link>
        </div>
      </div>
    </div>
  );
}
