"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/traveler-1.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/traveler-2.png",
  },
  {
    quote:
      "Exploring Kyoto With Wanderlust Was A Dream Come True. Seamless Transfers, Authentic Tea Ceremonies, And Unmatched Hospitality Throughout.",
    name: "David Miller",
    location: "London, UK",
    image: "/images/traveler-1.jpg.png",
  },
];

export default function Reviews() {
  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          {/* Section Header & Navigation Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-sans font-normal text-neutral-900 tracking-tight mb-2">
                What Travelers Say
              </h2>
              <p className="text-neutral-500 text-sm md:text-base">
                Real experiences from our happy travelers
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900" />
              <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900" />
            </div>
          </div>

          {/* Carousel Items */}
          <CarouselContent className="-ml-6">
            {reviews.map((item, index) => (
              <CarouselItem key={index} className="pl-6 md:basis-1/2">
                <div className="border border-neutral-200 bg-white p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
                  {/* Left Side: Quote & Author Info */}
                  <div className="flex flex-col justify-between h-full flex-1">
                    <p className="font-serif text-neutral-800 text-base md:text-[17px] leading-relaxed mb-6">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    <div>
                      <p className="text-[#00A8C6] text-sm font-medium">
                        — {item.name}
                      </p>
                      <p className="text-neutral-400 text-xs mt-0.5 pl-4">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Traveler Photo */}
                  <div className="w-full sm:w-48 h-56 shrink-0 overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}