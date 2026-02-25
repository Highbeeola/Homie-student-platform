import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export default function ContactPage() {
  // ⚠️ REPLACE THESE WITH YOUR REAL NUMBERS (No '+' sign)
  const admin1Number = "2347039926020"; // You
  const admin2Number = "2349138440907"; // Co-founder

  return (
    <div className="min-h-screen bg-[#041322] text-white px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
        <p className="text-gray-400 mb-12">
          Need help verifying your ID or have an issue with a listing? Chat with
          our admin team directly on WhatsApp.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Admin 1 Card */}
          <a
            href={`https://wa.me/${admin1Number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#25D366]/20 hover:border-[#25D366] transition-all group"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-[#25D366] rounded-full flex items-center justify-center text-black">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-lg">Main Support 1</h3>
            <p className="text-sm text-gray-400 mt-2 group-hover:text-green-400">
              Chat on WhatsApp &rarr;
            </p>
          </a>

          {/* Admin 2 Card */}
          <a
            href={`https://wa.me/${admin2Number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#25D366]/20 hover:border-[#25D366] transition-all group"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-[#25D366] rounded-full flex items-center justify-center text-black">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-lg">Main Support 2</h3>
            <p className="text-sm text-gray-400 mt-2 group-hover:text-green-400">
              Chat on WhatsApp &rarr;
            </p>
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500">Prefer email?</p>
          <a
            href="mailto:support@homie.com"
            className="inline-flex items-center gap-2 mt-2 text-[#00d4ff] hover:underline"
          >
            <Mail size={16} /> support@homie.com
          </a>
        </div>
      </div>
    </div>
  );
}
