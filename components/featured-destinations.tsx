import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, ArrowUpRight, Calendar, MapPin } from "lucide-react";

interface Destination {
  _id?: string;
  id?: string | number;
  image?: string;
  imageUrl?: string;
  img?: string;
  photo?: string;
  thumbnail?: string;
  title?: string;
  name?: string;
  destination?: string;
  destinationName?: string;
  place?: string;
  location?: string;
  country?: string;
  address?: string;
  duration?: string | number;
  rating?: string | number;
  price?: string | number;
}

const FeaturedDestinations = async () => {
  "use cache";
  const res = await fetch("http://localhost:5000/destination", {
    cache: "no-store",
  });
  const data: Destination[] = await res.json();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white text-neutral-900">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-sans font-normal tracking-tight text-neutral-900">
            Featured Destinations
          </h2>
          <p className="mt-2 text-xs md:text-sm text-neutral-500">
            Handpicked travel experiences for the adventure seekers
          </p>
        </div>

        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 border border-cyan-500 text-cyan-600 hover:bg-cyan-50 px-5 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors w-fit"
        >
          <span>ALL DESTINATIONS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Carousel Section */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-6">
          {data?.map((item: Destination, index: number) => {
            const imgSrc =
              item.image ||
              item.imageUrl ||
              item.img ||
              item.photo ||
              item.thumbnail ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";

            const titleText =
              item.title ||
              item.name ||
              item.destination ||
              item.destinationName ||
              item.place ||
              "Bali Paradise";

            const locationText =
              item.location || item.country || item.address || "Nepal";

            const durationText = item.duration
              ? String(item.duration).includes("Day")
                ? String(item.duration)
                : `${item.duration} Days/${Math.max(1, Number(item.duration) - 1)} Nights`
              : "7 Days/6 Nights";

            return (
              <CarouselItem
                key={item._id || item.id || index}
                className="pl-6 basis-[85%] sm:basis-[55%] lg:basis-[44%]"
              >
                <div className="group flex flex-col">
                  {/* Image Container & Rating Badge */}
                  <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-neutral-100">
                    <img
                      src={imgSrc}
                      alt={titleText}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1 text-xs font-semibold text-neutral-900 shadow-xs">
                      <span>{item.rating || "4.5"}</span>
                      <span className="text-black text-[11px]">★</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="pt-4 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{locationText}</span>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <h3 className="text-lg md:text-xl font-serif font-medium text-neutral-900 truncate">
                        {titleText}
                      </h3>
                      <div className="shrink-0 text-right">
                        <span className="text-base md:text-lg font-semibold text-neutral-900">
                          ${item.price || 2700}
                        </span>
                        <span className="text-[11px] text-neutral-500">/Person</span>
                      </div>
                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{durationText}</span>
                    </div>

                    <Link
                      href={`/destinations/${item._id || item.id}`}
                      className="mt-3.5 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-cyan-600 hover:text-cyan-700 transition-colors w-fit"
                    >
                      <span>BOOK NOW</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Bottom Controls */}
        <div className="mt-10 flex items-center justify-between gap-6">
          <span className="text-sm font-medium text-neutral-800 shrink-0">
            1/{data?.length || 1}
          </span>

          <div className="w-full h-[1.5px] bg-neutral-200" />

          <div className="flex items-center gap-3 shrink-0">
            <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900" />
            <CarouselNext className="static translate-y-0 h-9 w-9 rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900" />
          </div>
        </div>
      </Carousel>
    </section>
  );
};

export default FeaturedDestinations;