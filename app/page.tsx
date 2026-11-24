import { Banner } from "@/components/banner";
import CTA from "@/components/cta";
import FeaturedDestinations from "@/components/featured-destinations";
import Reviews from "@/components/reviews";
import WhyChoose from "@/components/why-choose";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Banner />
      <FeaturedDestinations />
      <WhyChoose />
      <Reviews />
      <CTA />
    </div>
  );
}