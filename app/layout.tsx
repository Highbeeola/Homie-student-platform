import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Homie Platform",
  description: "Student Housing Marketplace",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch the User (not just the session)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#001428] text-[#e6f9ff]`}
      >
        {/* 2. Pass 'user' prop correctly here */}
        <HeaderClient user={user} />

        <main className="min-h-screen">{children}</main>

       
      </body>
    </html>
  );
}
