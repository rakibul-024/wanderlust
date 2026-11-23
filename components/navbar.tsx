"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Destinations", href: "/destinations", active: false },
  { label: "Add-Destinations", href: "/add-destination", active: false },
  { label: "My Bookings", href: "#bookings", active: false },
  // { label: "Admin", href: "#admin", active: false },
];

const linkStyle =
  "text-[13px] font-medium text-slate-700 transition-colors hover:text-[#00A8D6]";

export function Navbar() {
  const [open, setOpen] = useState(false);

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
                  link.active && "font-semibold text-[#00A8D6]"
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
            aria-label="Wanderlast home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
          
            <span className="text-xl font-bold tracking-tight text-[#00A8D6]">
              Wanderlust
            </span>
          </Link>

          {/* Right: actions (desktop) */}
          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="#profile"
              className={cn(linkStyle, "flex items-center gap-1.5")}
            >
              <User className="h-3.5 w-3.5 text-slate-500" />
              Profile
            </Link>
            <Link href="#login" className={linkStyle}>
              Login
            </Link>
            <Link href="#signup" className={linkStyle}>
              Sign Up
            </Link>
          </div>

          {/* Right: compact signup (below lg) */}
          <div className="lg:hidden">
            <Link
              href="#signup"
              className="text-xs font-semibold text-[#00A8D6]"
            >
              Sign Up
            </Link>
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
                    link.active && "text-[#00A8D6]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 flex items-center gap-4 border-t border-slate-100 pt-2">
              <Link
                href="#profile"
                className={cn(linkStyle, "flex items-center gap-1.5")}
              >
                <User className="h-3.5 w-3.5 text-slate-500" />
                Profile
              </Link>
              <Link href="#login" className={linkStyle}>
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}