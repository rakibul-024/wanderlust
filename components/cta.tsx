import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full min-h-[380px] md:min-h-[420px] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Image */}
      <img
        src="/images/CTA.png"
        alt="Ready To Start Your Journey"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-white tracking-tight mb-3">
          Ready To Start Your Journey?
        </h2>

        <p className="text-neutral-200 text-sm sm:text-base mb-8">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="/destinations"
          className="inline-flex items-center gap-3 bg-white text-neutral-900 px-8 py-4 text-xs sm:text-sm font-medium tracking-wider uppercase hover:bg-neutral-100 transition-colors duration-200 group"
        >
          <span>BOOK YOUR TRIP TODAY</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}