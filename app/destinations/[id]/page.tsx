"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  MapPin,
  SquarePen,
  Star,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import EditDestinationPage from "../editDestinationPage";

// Static lists for highlights and booking perks
const HIGHLIGHTS = [
  "Luxury beachfront accommodation",
  "Visit Uluwatu Temple at sunset",
  "Traditional Balinese spa treatment",
  "Private beach dinner experience",
  "Sunrise trek to Mount Batur",
];

const PERKS = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];

interface DestinationItem {
  _id: string;
  destinationName: string;
  country: string;
  price: string | number;
  duration: string | number;
  imageUrl: string;
  rating?: string | number;
  description: string;
  departureDate?: string;
}

// Step 1: Main Destination Details & Dialog Actions Component
function DestinationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<DestinationItem | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Dialog open/close & action loading states
  const [openEdit, setOpenEdit] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Booking form state
  const [travelDate, setTravelDate] = useState("");
  const [bookingState, setBookingState] = useState<"idle" | "loading" | "error">("idle");

  // Form state for Edit Dialog
  const [formData, setFormData] = useState({
    destinationName: "",
    country: "",
    price: "",
    duration: "",
    imageUrl: "",
    description: "",
  });

  // Fetch destination data by ID
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch(`http://localhost:5000/destination/${id}`);
        if (res.ok) {
          // The backend answers 200 with an empty body for unknown IDs,
          // so read the text first and only parse when there is content.
          const raw = await res.text();
          if (!raw) return;
          const data = JSON.parse(raw);
          setItem(data);
          setTravelDate(data?.departureDate || "2026-05-15");
          setFormData({
            destinationName: data?.destinationName || "",
            country: data?.country || "",
            price: String(data?.price || ""),
            duration: String(data?.duration || ""),
            imageUrl: data?.imageUrl || "",
            description: data?.description || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch destination:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // Handle Update (PATCH request)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/destination/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setItem((prev) => (prev ? { ...prev, ...formData } : null));
        setOpenEdit(false);
      }
    } catch (error) {
      console.error("Failed to update destination:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete (DELETE request)
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/destination/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.deletedCount > 0) {
        setOpenCancel(false);
        setConfirmStep(false);
        router.push("/destinations");
      }
    } catch (error) {
      console.error("Failed to delete destination:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Book Now (create a booking, then go to My Bookings)
  const handleBookNow = async () => {
    if (!item || bookingState === "loading") return;
    setBookingState("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: item._id,
          destinationName: item.destinationName,
          country: item.country,
          price: Number(item.price) || 0,
          duration: Number(item.duration) || 0,
          imageUrl: item.imageUrl,
          travelDate: travelDate || item.departureDate || "",
        }),
      });
      if (!res.ok) throw new Error("Failed to create booking");
      router.push("/my-bookings");
    } catch (error) {
      console.error("Failed to create booking:", error);
      setBookingState("error");
    }
  };

  // Show loading state
  if (pageLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-neutral-500">
        Loading destination details...
      </div>
    );
  }

  // Show not found message if item is missing
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
      {/* Top Bar: Back Link & Edit/Delete Dialog Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-xs md:text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Destinations</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* ================= EDIT DIALOG ================= */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger render={<EditDestinationPage></EditDestinationPage>} />

            <DialogContent className="sm:max-w-lg bg-white">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl font-normal">
                  Edit Destination
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500">
                  Update the destination details below and click save.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpdate} className="space-y-4 text-sm mt-2">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destinationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinationName: e.target.value,
                      })
                    }
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-600 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-800"
                  />
                </div>

                <DialogFooter className="pt-2 gap-2">
                  <DialogClose
                    render={
                      <button
                        type="button"
                        className="px-4 py-2 text-xs border border-neutral-300 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                      >
                        Close
                      </button>
                    }
                  />
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 text-xs bg-[#0097B2] hover:bg-[#008299] text-white font-medium cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* ================= DELETE TRAVEL PACKAGE DIALOG ================= */}
          <Dialog
            open={openCancel}
            onOpenChange={(isOpen) => {
              setOpenCancel(isOpen);
              if (!isOpen) setConfirmStep(false);
            }}
          >
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete</span>
                </button>
              }
            />

            <DialogContent className="sm:max-w-[540px] bg-white p-8 rounded-none border border-neutral-200 shadow-lg">
              {!confirmStep ? (
                /* ---------- STEP 1: স্ক্রিনশট অনুযায়ী প্রথম মডাল ---------- */
                <div>
                  <DialogHeader className="text-left space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <DialogTitle className="font-serif text-2xl font-normal text-neutral-900">
                        Delete Travel Package
                      </DialogTitle>
                    </div>

                    <DialogDescription className="text-[15px] text-neutral-600 leading-relaxed pt-1">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-neutral-900">
                        &ldquo;{item.destinationName}&rdquo;
                      </span>
                      ? This action cannot be undone and will permanently remove
                      this travel package from the system.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="mt-8 flex flex-row justify-end items-center gap-3">
                    <DialogClose
                      render={
                        <button
                          type="button"
                          className="px-6 py-2.5 text-sm border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmStep(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-sm bg-[#E5484D] hover:bg-[#d63b40] text-white font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Package</span>
                    </button>
                  </DialogFooter>
                </div>
              ) : (
                /* ---------- STEP 2: দ্বিতীয়বার কনফার্মেশন চাওয়ার অংশ ---------- */
                <div>
                  <DialogHeader className="text-left space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <DialogTitle className="font-serif text-2xl font-normal text-red-600">
                        Are You Sure?
                      </DialogTitle>
                    </div>

                    <DialogDescription className="text-[15px] text-neutral-700 leading-relaxed pt-1">
                      Please confirm one more time: Do you really want to
                      permanently delete{" "}
                      <span className="font-semibold text-neutral-900">
                        &ldquo;{item.destinationName}&rdquo;
                      </span>
                      ? You won&apos;t be able to recover this package later.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="mt-8 flex flex-row justify-end items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmStep(false)}
                      disabled={actionLoading}
                      className="px-6 py-2.5 text-sm border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-sm bg-red-700 hover:bg-red-800 text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>
                        {actionLoading
                          ? "Deleting..."
                          : "Yes, Confirm Delete"}
                      </span>
                    </button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
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

      <hr className="border-neutral-200 my-8" />

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Side: Destination Details */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{item.country}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif font-normal text-neutral-900">
            {item.destinationName}
          </h1>

          {/* Rating & Duration */}
          <div className="mt-3 flex flex-wrap items-center gap-5 text-xs md:text-sm text-neutral-700">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span className="font-semibold">{item.rating || "4.9"}</span>
              <span className="text-neutral-400">(234 reviews)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <span className="font-medium">
                {item.duration} Days / {Number(item.duration) - 1} Nights
              </span>
            </div>
          </div>

          {/* Overview */}
          <section className="mt-10">
            <h2 className="text-xl md:text-2xl font-serif mb-3">Overview</h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {item.description}
            </p>
          </section>

          {/* Highlights */}
          <section className="mt-10">
            <h2 className="text-xl md:text-2xl font-serif mb-3">Highlights</h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8">
              {HIGHLIGHTS.map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Sticky Booking Card */}
        <aside className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-xs text-neutral-500">Starting from</p>
            <p className="mt-1 text-3xl md:text-4xl font-semibold text-[#0097B2]">
              ${item.price}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">per person</p>

            {/* Date Picker */}
            <input
              type="date"
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
              className="mt-6 w-full bg-[#F5F5F5] px-4 py-3 text-sm text-neutral-800 focus:outline-none"
            />

            {/* Book Now Action */}
            <button
              type="button"
              onClick={handleBookNow}
              disabled={bookingState === "loading"}
              className="mt-4 flex w-full items-center justify-center gap-2 bg-[#0097B2] px-6 py-3.5 text-xs font-medium text-white transition-colors hover:bg-[#008299] disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
            >
              <span>
                {bookingState === "loading" ? "Booking..." : "Book Now"}
              </span>
              {bookingState !== "loading" && <ArrowRight className="w-4 h-4" />}
            </button>
            {bookingState === "error" && (
              <p className="mt-2 text-xs font-medium text-red-600">
                Couldn&apos;t create your booking. Please try again.
              </p>
            )}

            {/* Included Perks */}
            <ul className="mt-6 space-y-2.5 text-xs text-neutral-600">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

// Step 2: Page Entry Point wrapped in Suspense
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