"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialButtons } from "@/components/social-buttons";
import { authClient } from "@/lib/auth-client";
import { usePostLoginPath } from "@/lib/post-login-redirect";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  // Where to go after signing in (set by proxy.ts via ?from=).
  const returnTo = usePostLoginPath();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    const res = await authClient.signIn.email({ email, password });
    if (res.error) {
      setError(res.error.message || "Invalid email or password.");
      setPending(false);
      return;
    }

    router.push(returnTo);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-[#F2FAFD] via-white to-white px-4 py-14">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-[#00A8D6]"
        >
          Wanderlust
        </Link>

        <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Sign in to continue planning your next adventure.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] text-neutral-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg border border-neutral-200 bg-white pl-10 text-sm focus-visible:border-[#0097B2] focus-visible:ring-[#0097B2]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px] text-neutral-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-lg border border-neutral-200 bg-white pl-10 pr-11 text-sm focus-visible:border-[#0097B2] focus-visible:ring-[#0097B2]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0097B2] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#008299] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              or continue with
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <SocialButtons callbackURL={returnTo} />

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup${returnTo !== "/my-bookings" ? `?from=${encodeURIComponent(returnTo)}` : ""}`}
              className="font-semibold text-[#0097B2] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
