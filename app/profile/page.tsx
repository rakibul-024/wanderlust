"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ProfileCard } from "@/components/profile/profile-card";
import { TravelStatistics } from "@/components/profile/travel-statistics";

interface Booking {
  _id: string;
  destinationName: string;
  country?: string;
  price: number;
  status?: string;
  travelDate?: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to load bookings");
        const data: Booking[] = await res.json();
        if (!cancelled) {
          setBookings(data);
          setStatsLoaded(true);
        }
      } catch {
        if (!cancelled) setStatsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const startEdit = () => {
    setNameValue(session?.user?.name ?? "");
    setNotice(null);
    setEditing(true);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameValue.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    setNotice(null);

    try {
      const res = await authClient.updateUser({ name: trimmed });
      if (res.error) {
        setNotice({ kind: "err", text: res.error.message || "Could not update your profile." });
        return;
      }

      setEditing(false);
      setNotice({ kind: "ok", text: "Profile updated successfully." });
    } catch {
      setNotice({ kind: "err", text: "Could not update your profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    if (photoUploading) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice({ kind: "err", text: "Choose a JPEG, PNG, or WebP image." });
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setNotice({ kind: "err", text: "Photo must be between 1 byte and 5 MB." });
      return;
    }

    setPhotoUploading(true);
    setNotice(null);
    try {
      const formData = new FormData();
      formData.set("photo", file);
      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error || "Could not upload your photo.");
      }

      setPhotoVersion((version) => version + 1);
      setNotice({ kind: "ok", text: "Profile photo updated." });
    } catch (error) {
      setNotice({
        kind: "err",
        text: error instanceof Error ? error.message : "Could not upload your photo.",
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-[#0097B2]" />
      </div>
    );
  }

  // Signed out: prompt to sign in.
  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-[#F2FAFD] via-white to-white px-4 py-14">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Profile</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to view your profile, travel statistics and bookings.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login?from=%2Fprofile"
              className="rounded-lg bg-[#0097B2] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#008299]"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-neutral-200 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#0097B2] hover:text-[#0097B2]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user;
  const activeBookings = bookings.filter((booking) => booking.status !== "Cancelled");
  const tripsBooked = activeBookings.length;
  const countriesVisited = new Set(
    activeBookings.map((booking) => booking.country).filter(Boolean)
  ).size;
  const totalSpent = activeBookings.reduce(
    (sum, booking) => sum + (Number(booking.price) || 0),
    0
  );
  const upcomingTrips = activeBookings.filter((booking) => {
    const status = booking.status ?? "Pending";
    return status === "Pending" || status === "Confirmed";
  }).length;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-[75vh] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1000px]">
        <header>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900">
            My Profile
          </h1>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Manage your account settings and travel preferences
          </p>
        </header>

        <div className="mt-5 grid items-start gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
          <ProfileCard
            name={user.name}
            memberSince={memberSince}
            photoUrl={`/api/profile/photo?v=${photoVersion}`}
            photoUploading={photoUploading}
            editing={editing}
            nameValue={nameValue}
            saving={saving}
            notice={notice}
            onPhotoSelected={uploadProfilePhoto}
            onEdit={startEdit}
            onNameChange={setNameValue}
            onSave={saveProfile}
            onCancel={() => {
              setEditing(false);
              setNotice(null);
            }}
          />
          <TravelStatistics
            tripsBooked={tripsBooked}
            countriesVisited={countriesVisited}
            upcomingTrips={upcomingTrips}
            totalSpent={totalSpent}
            loaded={statsLoaded}
          />
        </div>
      </div>
    </main>
  );
}
