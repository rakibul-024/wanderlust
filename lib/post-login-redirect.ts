"use client";

import { useSyncExternalStore } from "react";

const DEFAULT_AFTER_LOGIN = "/my-bookings";

/**
 * Reads the `?from=` query param added by `proxy.ts` and returns a safe
 * same-origin path to return to after signing in / signing up.
 *
 * Reads `window.location` directly (instead of `useSearchParams`) so the auth
 * pages don't need a Suspense boundary, and uses `useSyncExternalStore` so the
 * server-rendered output (which can't see `window`) stays consistent.
 */
function readReturnTo(): string {
  const from = new URLSearchParams(window.location.search).get("from");

  // Only allow same-origin relative paths — no protocol-relative or escaped URLs.
  if (from && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/\\")) {
    return from;
  }

  return DEFAULT_AFTER_LOGIN;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getServerSnapshot(): string {
  return DEFAULT_AFTER_LOGIN;
}

export function usePostLoginPath(): string {
  return useSyncExternalStore(subscribe, readReturnTo, getServerSnapshot);
}
