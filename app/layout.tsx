import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient"; // The Navbar
import { Footer } from "@/components/Footer"; // The Footer
import { createSupabaseServerClient } from "@/lib/supabaseServer"; // For Auth

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Professional SEO Metadata
export const metadata: Metadata = {
  title: "Homie | Student Housing Marketplace",
  description:
    "Find affordable student hostels and roommates in Nigeria. No agent fees, direct connection.",
  keywords: [
    "student housing",
    "hostels",
    "Nigeria",
    "roommates",
    "campus accommodation",
  ],
  openGraph: {
    title: "Homie - Student Housing Made Simple",
    description:
      "Stop paying crazy agent fees. Find your next lodge or roommate directly on Homie.",
    url: "https://homie-student-platform.vercel.app",
    siteName: "Homie",
    images: [
      {
        url: "/og-image.png", // Ensure this exists in public/ later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

// 2. Make the Layout Async to fetch Auth Data
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 3. Check Session (So the Header knows if you are logged in)
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body
        // 4. Apply Dark Theme + Fonts
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#001428] text-[#e6f9ff]`}
      >
        {/* 5. Header (Visible on ALL pages) */}
        <HeaderClient session={session} />

        {/* 6. Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* 7. Footer (Visible on ALL pages) */}
        <Footer />
      </body>
    </html>
  );
}
