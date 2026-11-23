import { ShieldCheck, Map, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: Map,
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChoose() {
  return (
    <section className="w-full bg-[#EAF8FB] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 tracking-tight mb-3">
            Why Choose Wanderlust
          </h2>
          <p className="text-neutral-600 text-sm md:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 md:p-10 shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-6">
                  <Icon className="w-7 h-7 text-[#00A8C6]" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-serif font-medium text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}