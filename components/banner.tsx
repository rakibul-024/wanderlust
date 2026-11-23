"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchFields = [
  {
    key: "location",
    icon: MapPin,
    label: "Location",
    placeholder: "Address, City Or Zip",
  },
  {
    key: "date",
    icon: CalendarDays,
    label: "Date/Duration",
    placeholder: "Anytime/3 Days",
  },
  {
    key: "budget",
    icon: Wallet,
    label: "Budget",
    placeholder: "$0-$3000",
  },
  {
    key: "people",
    icon: Users,
    label: "People",
    placeholder: "5-10",
  },
] as const;

export function Banner() {
  const [filters, setFilters] = useState({
    location: "",
    date: "",
    budget: "",
    people: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", filters);
  };

  return (
    <section className="relative isolate flex h-screen min-h-[650px] w-full flex-col justify-between overflow-hidden">
      {/* Background image + scrim */}
      <Image
        src="/images/Banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/40" />

      {/* Headline block */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-12 text-center">
        <h1 className="font-heading max-w-4xl text-5xl font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-md text-xs leading-6 text-white/90 sm:text-sm">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
       <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <Button className="h-auto gap-2.5 rounded-none bg-[#00A8D6] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#0092ba]">
            EXPLORE NOW
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button className="h-auto rounded-none bg-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/40">
            VIEW DESTINATION
          </Button>
        </div>
      </div>

      {/* Bottom Search Bar */}
      <form
        onSubmit={handleSearch}
        className="relative z-10 w-full bg-white/30 backdrop-blur-md"
      >
        <div className="flex flex-col lg:flex-row">
          <div className="grid flex-1 grid-cols-1 divide-y divide-white/25 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {searchFields.map(({ key, label, placeholder }) => (
              <label
                key={key}
                className="flex flex-col justify-center px-6 py-4 text-left transition hover:bg-white/10"
              >
                <span className="text-xs font-semibold text-white">
                  {label}
                </span>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={filters[key]}
                  onChange={(e) =>
                    setFilters({ ...filters, [key]: e.target.value })
                  }
                  className="mt-0.5 w-full bg-transparent text-xs text-white placeholder:text-white/80 focus:outline-none"
                />
              </label>
            ))}
          </div>
          <Button
            type="submit"
            className="h-auto min-h-[64px] w-full rounded-none bg-[#00A8D6] px-10 text-xs font-semibold text-white hover:bg-[#0092ba] lg:w-44"
          >
            Search
          </Button>
        </div>
      </form>
    </section>
  );
}