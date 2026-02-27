import Link from "next/link";

export function Footer() {
  const platformLinks = [
    { name: "Browse All Spaces", href: "/browse" },
    { name: "List a Space", href: "/add-listing" },
    { name: "How It Works", href: "/how-it-works" },
  ];
  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    // ✅ ADDED "bg-[#001428] text-slate-400" HERE
    <footer className="mt-24 border-t border-white/10 pt-16 pb-8 bg-[#001428] text-slate-400">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mx-auto max-w-6xl px-4">
        {/* Column 1: Brand Info */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-white font-bold shadow-lg">
              H
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white">Homie</h1>
            </div>
          </Link>
          <p className="mt-4 text-slate-400 max-w-xs">
            The trusted peer-to-peer platform for student housing in Nigeria,
            built by students, for students.
          </p>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h3 className="font-semibold text-white">Platform</h3>
          <ul className="mt-4 space-y-2">
            {platformLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Company Links */}
        <div>
          <h3 className="font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8 text-center text-slate-500">
        <p>© {new Date().getFullYear()} Homie Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}
