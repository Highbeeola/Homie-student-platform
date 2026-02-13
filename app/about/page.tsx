// app/about/page.tsx
import { Header } from "@/components/Header";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#001428] text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Header />
        <h1 className="mt-8 text-4xl font-bold">About Homie</h1>
        <p className="mt-4 text-lg text-gray-300">
          Homie is a peer-to-peer student accommodation marketplace for
          Nigeria...
          {/* Add a few more paragraphs explaining the mission */}
        </p>
      </div>
    </div>
  );
}
