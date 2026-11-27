"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Add Destinations", href: "/add-destination" },
  { label: "My Bookings", href: "/my-bookings" },
];

const linkStyle =
  "text-[13px] font-medium text-slate-700 transition-colors hover:text-[#00A8D6]";

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 pd-5 sm:px-4">
      <div className="mx-auto w-full bg-white shadow-sm">
        <div className="relative flex items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Left: primary navigation (desktop) */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  linkStyle,
                  isActiveLink(pathname, link.href) && "font-semibold text-[#00A8D6]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Left: mobile menu toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Center: brand */}
          <Link
            href="/"
            aria-label="Wanderlust home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="text-xl font-bold tracking-tight text-[#00A8D6]">
              Wanderlust
            </span>
          </Link>

          {/* Right: actions (desktop) */}
          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="/profile"
              className={cn(
                linkStyle,
                "flex items-center gap-1.5",
                isActiveLink(pathname, "/profile") && "font-semibold text-[#00A8D6]"
              )}
            >
              <User className="h-3.5 w-3.5 text-slate-500" />
              Profile
            </Link>
            {session ? (
              <>
                <span
                  className="max-w-28 truncate text-[13px] font-medium text-slate-500"
                  title={session.user.email}
                >
                  {session.user.name}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(linkStyle, "cursor-pointer")}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    linkStyle,
                    isActiveLink(pathname, "/login") && "font-semibold text-[#00A8D6]"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={cn(
                    linkStyle,
                    isActiveLink(pathname, "/signup") && "font-semibold text-[#00A8D6]"
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Right: compact action (below lg) */}
          <div className="lg:hidden">
            {session ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-semibold text-[#00A8D6]"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/signup" className="text-xs font-semibold text-[#00A8D6]">
                Sign Up
              </Link>
            )}
          </div>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-2 py-1.5 text-sm font-medium text-slate-700",
                    isActiveLink(pathname, link.href) && "text-[#00A8D6]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 flex items-center gap-4 border-t border-slate-100 pt-2">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={cn(linkStyle, "flex items-center gap-1.5")}
              >
                <User className="h-3.5 w-3.5 text-slate-500" />
                Profile
              </Link>
              {session ? (
                <button type="button" onClick={handleSignOut} className={linkStyle}>
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className={linkStyle}>
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className={linkStyle}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
