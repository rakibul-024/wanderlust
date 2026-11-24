import React, { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  MapPin,
  SquarePen,
  Star,
  Trash2,
} from "lucide-react";

// Fetch single destination by ID
async function getDestinationById(id: string) {
  "use cache";
  try {
    const res = await fetch(`http://localhost:5000/destination/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Main content component
async function DestinationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getDestinationById(id);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-neutral-800">
          Destination not found
        </h2>
        <Link
          href="/destinations"
          className="mt-4 inline-block text-sm text-cyan-600 underline"
        >
          Back to Destinations
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 bg-white text-neutral-900">
      {/* Top Bar: Back link and Edit/Cancel buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-xs md:text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Destinations</span>
        </Link>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors">
            <SquarePen className="w-3.5 h-3.5 text-neutral-700" />
            <span>Edit</span>
          </button>
          <button className="inline-flex items-center gap-2 border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="w-full h-[280px] sm:h-[400px] md:h-[460px] overflow-hidden bg-neutral-100">
        <img
          src={item.imageUrl}
          alt={item.destinationName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Subtle Divider */}
      <div className="border-t border-neutral-200 my-8" />

      {/* Main Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Title, Overview & Highlights */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span>{item.country}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif font-normal tracking-tight text-neutral-900">
            {item.destinationName}
          </h1>

          {/* Rating & Duration Meta Row */}
          <div className="mt-3 flex flex-wrap items-center gap-5 text-xs md:text-sm text-neutral-700">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span className="font-semibold text-neutral-900">
                {item.rating || "4.9"}
              </span>
              <span className="text-neutral-400">(234 reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-700">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <span className="font-medium">
                {item.duration} Days / {Number(item.duration) - 1} Nights
              </span>
            </div>
          </div>

          {/* Overview Section */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-serif font-normal text-neutral-900 mb-3">
              Overview
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Highlights Section */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-serif font-normal text-neutral-900 mb-3">
              Highlights
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
              {item.description}
            </p>

            {/* 2-Column Green Checkmark List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Luxury beachfront accommodation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Visit Uluwatu Temple at sunset</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Traditional Balinese spa treatment</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Private beach dinner experience</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sunrise trek to Mount Batur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-xs text-neutral-500">Starting from</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-semibold text-[#0097B2]">
                ${item.price}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">per person</p>

            {/* Date Input */}
            <div className="mt-6">
              <input
                type="date"
                defaultValue="2026-05-15"
                className="w-full bg-[#F5F5F5] border border-transparent focus:border-neutral-300 px-4 py-3 text-sm text-neutral-800 focus:outline-none"
              />
            </div>

            {/* Book Now Link: Change href to your booking page route */}
            <Link
              href={`/my Booking/${item._id}`}
              className="mt-4 w-full bg-[#0097B2] hover:bg-[#008299] text-white py-3.5 px-6 text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Included Perks List */}
            <ul className="mt-6 space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Free cancellation up to 7 days</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Travel insurance included</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// Page Entry Point with Suspense
export default function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-neutral-500">
          Loading destination details...
        </div>
      }
    >
      <DestinationContent params={params} />
    </Suspense>
  );
}