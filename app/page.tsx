import { Banner } from "@/components/banner";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import Reviews from "@/components/reviews";
import WhyChoose from "@/components/why-choose";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
    
      <Banner />
      <WhyChoose/>
      <Reviews/>
      <CTA/>
      

    </div>
  );
}
