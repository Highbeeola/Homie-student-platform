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
    <footer className="mt-24 border-t border-white/10 pt-16 pb-8 bg-[#001428] text-slate-400">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mx-auto max-w-6xl px-4">
        {/* Column 1: Brand Info */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-4 group">
            {/* ✅ UPDATED LOGO: Matches Header exactly (Dark text on Gradient) */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#8A6CFF] text-xl font-extrabold text-[#041322] shadow-lg group-hover:scale-105 transition-transform">
              H
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Homie
              </h1>
              <span className="text-[10px]  font-medium  tracking-wider block -mt-1">
                Student heling students
              </span>
            </div>
          </Link>
          <p className="mt-6 text-slate-400 max-w-xs leading-relaxed">
            The trusted peer-to-peer platform for student housing in Nigeria.
            Built by students, for students.
          </p>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">
            Platform
          </h3>
          <ul className="space-y-3">
            {platformLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-[#00d4ff] transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Company Links */}
        <div>
          <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">
            Company
          </h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-[#00d4ff] transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Homie Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}
