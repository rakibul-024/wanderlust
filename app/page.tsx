import { Banner } from "@/components/banner";
import { Navbar } from "@/components/navbar";
import WhyChoose from "@/components/why-choose";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <Banner />
      <WhyChoose/>

    </div>
  );
}
