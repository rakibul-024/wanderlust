"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [actionLoading, setActionLoading] = useState(false);

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
          const data = await res.json();
          setItem(data);
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

  // Handle Delete / Cancel (DELETE request)
 const handleDelete = async () => {
  setActionLoading(true);
  try {
    const res = await fetch(`http://localhost:5000/destination/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok && data.deletedCount > 0) {
      setOpenCancel(false);
      router.push("/destinations");
    }
  } catch (error) {
    console.error("Failed to delete destination:", error);
  } finally {
    setActionLoading(false);
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
      {/* Top Bar: Back Link & Edit/Cancel Dialog Buttons */}
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
            <DialogTrigger
              render={
              
                <EditDestinationPage></EditDestinationPage>
              }
            />

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

          {/* ================= CANCEL / DELETE DIALOG ================= */}
          <Dialog open={openCancel} onOpenChange={setOpenCancel}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Cancel</span>
                </button>
              }
            />

            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl font-normal text-neutral-900">
                  Cancel Destination?
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-600 pt-1">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-neutral-900">
                    {item.destinationName}
                  </span>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="pt-4 gap-2">
                <DialogClose
                  render={
                    <button
                      type="button"
                      className="px-4 py-2 text-xs border border-neutral-300 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                    >
                      Keep It
                    </button>
                  }
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Deleting..." : "Yes, Cancel"}
                </button>
              </DialogFooter>
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
              defaultValue="2026-05-15"
              className="mt-6 w-full bg-[#F5F5F5] px-4 py-3 text-sm text-neutral-800 focus:outline-none"
            />

            {/* Book Now Link */}
            <Link
              href={`/my-booking/${item._id}`}
              className="mt-4 w-full bg-[#0097B2] hover:bg-[#008299] text-white py-3.5 px-6 text-xs md:text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

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