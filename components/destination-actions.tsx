"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, SquarePen, Trash2 } from "lucide-react";

interface DestinationProps {
  destination: {
    _id?: string;
    id?: string | number;
    destinationName?: string;
    title?: string;
    name?: string;
    country?: string;
    location?: string;
    price?: string | number;
    departureDate?: string;
    duration?: string | number;
    imageUrl?: string;
    image?: string;
  };
}

export function TopActionButtons({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this destination?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/destination/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/destinations");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => router.push(`/destinations/edit/${id}`)}
        className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
      >
        <SquarePen className="w-3.5 h-3.5 text-neutral-700" />
        <span>Edit</span>
      </button>

      <button
        onClick={handleDelete}
        className="inline-flex items-center gap-2 border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
        <span>Cancel</span>
      </button>
    </div>
  );
}

export function BookingSidebarCard({ destination }: DestinationProps) {
  const router = useRouter();
  const [travelDate, setTravelDate] = useState(
    destination.departureDate || "2026-05-15"
  );
  const [loading, setLoading] = useState(false);

  const handleBookNow = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        destinationId: destination._id || destination.id,
        destinationName:
          destination.destinationName ||
          destination.title ||
          destination.name ||
          "Bali Paradise",
        country: destination.country || destination.location || "Indonesia",
        price: destination.price || 1299,
        duration: destination.duration || 7,
        imageUrl: destination.imageUrl || destination.image,
        travelDate,
        status: "Confirmed",
        bookedAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (res.ok) {
        alert("Booking Confirmed!");
        router.push("/my-bookings");
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
      <p className="text-xs text-neutral-500">Starting from</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl md:text-4xl font-semibold text-[#0097B2]">
          ${destination.price || 1299}
        </span>
      </div>
      <p className="text-xs text-neutral-400 mt-0.5">per person</p>

      {/* Date Input */}
      <div className="mt-6">
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="w-full bg-[#F5F5F5] border border-transparent focus:border-neutral-300 px-4 py-3 text-sm text-neutral-800 focus:outline-none"
        />
      </div>

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        disabled={loading}
        className="mt-4 w-full bg-[#0097B2] hover:bg-[#008299] text-white py-3.5 px-6 text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
      >
        <span>{loading ? "Booking..." : "Book Now"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Perks List */}
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
  );
}