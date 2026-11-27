"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialButtons } from "@/components/social-buttons";
import { authClient } from "@/lib/auth-client";
import { usePostLoginPath } from "@/lib/post-login-redirect";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  // Where to go after signing up (set by proxy.ts via ?from=).
  const returnTo = usePostLoginPath();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setPending(true);
    setError("");

    const res = await authClient.signUp.email({ name, email, password });
    if (res.error) {
      setError(res.error.message || "Could not create your account.");
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
            Create Account
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Join Wanderlust to plan, book and track your trips.
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
              <Label htmlFor="name" className="text-[13px] text-neutral-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-lg border border-neutral-200 bg-white pl-10 text-sm focus-visible:border-[#0097B2] focus-visible:ring-[#0097B2]/20"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[13px] text-neutral-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-lg border border-neutral-200 bg-white pl-10 text-sm focus-visible:border-[#0097B2] focus-visible:ring-[#0097B2]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0097B2] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#008299] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {pending ? "Creating account..." : "Sign Up"}
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
            Already have an account?{" "}
            <Link
              href={`/login${returnTo !== "/my-bookings" ? `?from=${encodeURIComponent(returnTo)}` : ""}`}
              className="font-semibold text-[#0097B2] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
