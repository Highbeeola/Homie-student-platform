// components/HowItWorks.tsx
import { Search, Link, Home } from "lucide-react";

const steps = [
  {
    icon: <Search size={32} className="text-[#00d4ff]" />,
    title: "1. Browse or List",
    description:
      "Find verified listings or list your own space in just a few minutes.",
  },
  {
    icon: <Link size={32} className="text-[#8A6CFF]" />,
    title: "2. Connect Securely",
    description:
      "Connect directly with fellow students. No agents, no hidden fees.",
  },
  {
    icon: <Home size={32} className="text-[#FF7A66]" />,
    title: "3. Get Settled",
    description:
      "Meet, finalize the arrangements, and move into your new student home.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
          Finding your student accommodation has never been easier.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {steps.map((step) => (
          <div
            key={step.title}
            className="p-8 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-800 mx-auto">
              {step.icon}
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-blue-200">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
