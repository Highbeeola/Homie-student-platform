import { Footer } from "@/components/Footer"; // Re-use footer if not in layout (but it is in layout now, so usually no need)
// Actually, since Layout handles Header/Footer, we just need content.

export default function AboutPage() {
  return (
    <div className="bg-[#041322] min-h-screen pt-12 pb-20 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            About <span className="text-[#00d4ff]">Homie</span>
          </h1>
          <p className="text-xl text-gray-400">
            Built by students, for students.
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-[#bcdff0]">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Finding accommodation in Nigerian universities is a nightmare.
              Agents charge exorbitant fees (sometimes 20-30%), scams are
              rampant, and finding a roommate is purely luck.
              <br />
              <br />
              Homie exists to solve this. We connect students directly with
              landlords or other students, cutting out the middleman and
              verifying identities for safety.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-[#bcdff0]">
              How We Protect You
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-3">
                <span>
                  <strong>ID Verification:</strong> We verify the student ID/NIN
                  of sellers before they get the "Verified" badge.
                </span>
              </li>
              <li className="flex gap-3">
                <span>
                  <strong>Direct Contact:</strong> You chat directly via
                  WhatsApp. No hidden platform fees for messaging.
                </span>
              </li>
              <li className="flex gap-3">
                <span>
                  <strong>Community Moderation:</strong> Our admin team actively
                  monitors listings to remove fake posts.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team / Contact */}
        <div className="text-center pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
          <p className="text-gray-400 mb-6">
            We are active on campus. Reach out to us anytime.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#00d4ff] text-[#041322] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
