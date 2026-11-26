"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import { cn } from "cn";

interface Booking {
  _id: string;
  destinationId?: string;
  destinationName: string;
  country?: string;
  price: number;
  duration?: number;
  imageUrl?: string;
  travelDate?: string;
  status?: string;
  bookedAt?: string;
}

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(value?: string) {
  if (!value) return "TBA";
  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

function bookingCode(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  // Destination IDs that still exist in the backend. null = unknown (fetch
  // failed), in which case we keep showing View as a best effort.
  const [availableIds, setAvailableIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAvailable = async () => {
      try {
        const res = await fetch("http://localhost:5000/destination");
        if (!res.ok) return;
        // The backend answers 200 with an empty body for no results.
        const raw = await res.text();
        if (!raw) return;
        const list: Array<{ _id?: string }> = JSON.parse(raw);
        const ids = new Set<string>();
        for (const entry of list) if (entry._id) ids.add(entry._id);
        if (!cancelled) setAvailableIds(ids);
      } catch {
        // Backend unreachable — leave as null so View stays visible.
      }
    };

    loadAvailable();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to load bookings");
        const data: Booking[] = await res.json();
        if (!cancelled) setBookings(data);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const cancelBooking = useCallback(
    async (id: string) => {
      setActionId(id);
      setActionError("");
      try {
        const res = await fetch("/api/bookings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "Cancelled" }),
        });
        if (!res.ok) throw new Error("Failed to cancel");
        // Cancelled bookings are hidden from the list — drop it right away
        // so it disappears without a reload.
        setBookings((prev) => prev.filter((booking) => booking._id !== id));
      } catch {
        setActionError("Couldn't cancel this booking. Please try again.");
      } finally {
        setActionId(null);
        setConfirmingId(null);
      }
    },
    []
  );

  return (
    <div className="min-h-[75vh] bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Track and manage all your upcoming trips in one place.
            </p>
          </div>
          <Link
            href="/destinations"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-[#0097B2] hover:text-[#0097B2]"
          >
            Book another trip
          </Link>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
          >
            {actionError}
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="space-y-4" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
                />
              ))}
            </div>
          ) : failed ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center">
              <p className="text-sm font-medium text-neutral-700">
                We couldn&apos;t load your bookings.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0097B2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008299]"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center">
              <Calendar className="mx-auto h-8 w-8 text-neutral-400" />
              <h2 className="mt-4 text-lg font-semibold text-neutral-800">No bookings yet</h2>
              <p className="mt-1 text-sm text-neutral-500">
                When you book a trip, it will show up here.
              </p>
              <Link
                href="/destinations"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0097B2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008299]"
              >
                Explore Destinations
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = booking.status || "Pending";
                const isCancelled = status === "Cancelled";
                const confirming = confirmingId === booking._id;
                const acting = actionId === booking._id;

                return (
                  <article
                    key={booking._id}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      {/* Thumbnail */}
                      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-24 sm:w-40">
                        {booking.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={booking.imageUrl}
                            alt={booking.destinationName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-base font-semibold text-neutral-900">
                            {booking.destinationName}
                          </h2>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
                              STATUS_STYLES[status] ?? STATUS_STYLES.Pending
                            )}
                          >
                            {status}
                          </span>
                        </div>

                        {booking.country && (
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                            {booking.country}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-neutral-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                            Departure:{" "}
                            <span className="font-medium text-neutral-800">
                              {formatDate(booking.travelDate)}
                            </span>
                          </span>
                          <span>
                            Booking ID:{" "}
                            <span className="font-mono font-medium text-neutral-800">
                              {bookingCode(booking._id)}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Price + actions */}
                      <div className="flex flex-row items-center justify-between gap-4 border-neutral-100 sm:flex-col sm:items-end sm:border-l sm:pl-6">
                        <div className="text-left sm:text-right">
                          <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                            Total
                          </p>
                          <p className="text-xl font-bold text-[#0097B2]">
                            ${Number(booking.price) || 0}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isCancelled && (
                            <button
                              type="button"
                              disabled={acting}
                              onClick={() => {
                                if (confirming) {
                                  cancelBooking(booking._id);
                                } else {
                                  setConfirmingId(booking._id);
                                }
                              }}
                              onBlur={() => {
                                if (confirmingId === booking._id) setConfirmingId(null);
                              }}
                              className={cn(
                                "rounded-lg border px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                confirming
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : "border-neutral-200 bg-white text-neutral-700 hover:border-red-200 hover:text-red-600"
                              )}
                            >
                              {acting ? "Cancelling..." : confirming ? "Confirm?" : "Cancel"}
                            </button>
                          )}
                          {booking.destinationId &&
                            (availableIds === null ||
                            availableIds.has(booking.destinationId) ? (
                              <Link
                                href={`/destinations/${booking.destinationId}`}
                                className="rounded-lg bg-[#0097B2] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#008299]"
                              >
                                View
                              </Link>
                            ) : (
                              // Destination was removed from the catalog —
                              // no point linking to a page that 404s.
                              <span className="cursor-not-allowed rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-400">
                                Unavailable
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {!loading && !failed && bookings.length > 0 && (
          <p className="mt-6 text-xs text-neutral-400">
            {bookings.length} booking{bookings.length === 1 ? "" : "s"} on file
          </p>
        )}
      </div>
    </div>
  );
}
