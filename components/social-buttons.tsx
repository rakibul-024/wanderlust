"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .5C5.73.5.99 5.24.99 11.5c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53 0-.26-.01-.95-.02-1.86-3.06.66-3.71-1.48-3.71-1.48-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.98 1.7 2.58 1.21 3.21.93.1-.72.39-1.21.7-1.49-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.04-1.13 3.04-1.13.61 1.53.22 2.66.11 2.94.71.77 1.14 1.75 1.14 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.01.75 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53 4.36-1.46 7.51-5.58 7.51-10.44C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

type SocialButtonsProps = {
  callbackURL?: string;
  className?: string;
};

export function SocialButtons({ callbackURL = "/my-bookings", className }: SocialButtonsProps) {
  const [pending, setPending] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState("");

  const handleSocial = async (provider: "github" | "google") => {
    if (pending) return;
    setPending(provider);
    setError("");

    // On success the client redirects to the provider (and back to callbackURL).
    const res = await authClient.signIn.social({ provider, callbackURL });
    if (res.error) {
      setError(res.error.message || "Could not continue with this provider.");
      setPending(null);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => handleSocial("github")}
          className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GitHubIcon className="h-4 w-4" />
          {pending === "github" ? "Redirecting..." : "GitHub"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => handleSocial("google")}
          className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon className="h-4 w-4" />
          {pending === "google" ? "Redirecting..." : "Google"}
        </button>
      </div>
      {error && <p className="mt-2.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
