import React from 'react';
import Link from 'next/link';

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

const AllDestinationsPage = async () => {
    'use cache'
  const res = await fetch('http://localhost:5000/destination', {
    cache: 'no-store',
  });
  const data: Destination[] = await res.json();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-neutral-900">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-[42px] font-serif font-normal tracking-tight text-neutral-900">
          Explore All Destinations
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Find your perfect travel experience from our curated collection
        </p>
      </div>

      {/* Destination Count */}
      <p className="text-xs text-neutral-600 mb-6">
        Showing {data?.length || 0} destinations
      </p>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 w-full">
        {data?.map((item: Destination, index: number) => {
          const imgSrc =
            item.image ||
            item.imageUrl ||
            item.img ||
            item.photo ||
            item.thumbnail ||
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';

          const titleText =
            item.title ||
            item.name ||
            item.destination ||
            item.destinationName ||
            item.place ||
            'Bali Paradise';

          const locationText =
            item.location || item.country || item.address || 'Nepal';

          const durationText = item.duration
            ? String(item.duration).includes('Day')
              ? String(item.duration)
              : `${item.duration} Days/${Math.max(1, Number(item.duration) - 1)} Nights`
            : '7 Days/6 Nights';

          return (
            <div key={item._id || item.id || index} className="group flex flex-col">
              {/* Image Container & Rating Badge */}
              <div className="relative w-full h-56 overflow-hidden bg-neutral-100">
                <img
                  src={imgSrc}
                  alt={titleText}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Top-Right Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1 text-xs font-semibold text-neutral-900 shadow-sm">
                  <span>{item.rating || '4.5'}</span>
                  <span className="text-black text-[11px]">★</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="pt-3.5 flex flex-col">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <span>{locationText}</span>
                </div>

                {/* Title & Price Row */}
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-serif font-medium text-neutral-900 truncate">
                    {titleText}
                  </h2>
                  <div className="shrink-0 text-right">
                    <span className="text-base font-semibold text-neutral-900">
                      ${item.price || 2700}
                    </span>
                    <span className="text-[11px] text-neutral-500">/Person</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <span>{durationText}</span>
                </div>

                {/* Book Now Action */}
                <Link
                  href={`/destinations/${item._id || item.id}`}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-cyan-600 hover:text-cyan-700 transition-colors w-fit"
                >
                  <span>BOOK NOW</span>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AllDestinationsPage;