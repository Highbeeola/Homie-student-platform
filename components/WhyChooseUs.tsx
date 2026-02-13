// components/WhyChooseUs.tsx
import { ShieldCheck, School, CreditCard } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={28} className="text-green-400" />,
    title: "Verified Students",
    description:
      "Our future verification system will ensure every user is a real student, creating a safe and trusted community.",
  },
  {
    icon: <School size={28} className="text-blue-400" />,
    title: "Campus-Focused",
    description:
      "Designed exclusively for Nigerian universities, we understand the local housing needs and student budgets.",
  },
  {
    icon: <CreditCard size={28} className="text-purple-400" />,
    title: "No Agent Fees",
    description:
      "Connect directly with graduating students and save money by cutting out the middleman's expensive fees.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-white/5 rounded-2xl">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white">
          Why Choose Homie?
        </h2>
        <p className="mt-4 text-lg text-blue-200 max-w-3xl mx-auto">
          We're building more than a platform; we're building a community you
          can trust for your most important move.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 mt-1">{feature.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-blue-200">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
