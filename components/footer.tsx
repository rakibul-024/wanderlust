"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // এখানে আপনার নিউজলেটার সাবস্ক্রিপশন লজিক যুক্ত করতে পারেন
    setEmail("");
  };

  return (
    <footer className="w-full bg-black text-white pt-16 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Brand Section */}
        <div className="mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white mb-3">
            Wanderlast
          </h2>
          <p className="text-neutral-300 text-sm md:text-base">
            Your gateway to extraordinary travel experiences around the world.
          </p>
        </div>

        {/* Middle 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-16">
          {/* Newsletter Column (Wider on desktop) */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-sm md:text-base uppercase tracking-wider text-white mb-2">
              NEWSLETTER
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm mb-5">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center bg-[#2A2A2A] max-w-xs"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-4 py-3 text-white hover:text-neutral-300 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:pl-8">
            <h3 className="font-serif text-sm md:text-base uppercase tracking-wider text-white mb-5">
              QUICK LINKS
            </h3>
            <ul className="space-y-3.5 text-sm text-neutral-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="hover:text-white transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings"
                  className="hover:text-white transition-colors"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-white transition-colors"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-sm md:text-base uppercase tracking-wider text-white mb-5">
              SUPPORT
            </h3>
            <ul className="space-y-3.5 text-sm text-neutral-300">
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-sm md:text-base uppercase tracking-wider text-white mb-5">
              CONTACT US
            </h3>
            <ul className="space-y-3.5 text-sm text-neutral-300">
              <li>
                <a
                  href="tel:7869011622"
                  className="hover:text-white transition-colors"
                >
                  786 901 1622
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wandarland.com"
                  className="hover:text-white transition-colors"
                >
                  info@wandarland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Social Icons */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-xs">
            © 2026 Wanderlust. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-white">
            {/* X (Twitter) Icon */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="hover:text-neutral-400 transition-colors"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn Icon */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-neutral-400 transition-colors"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* Instagram Icon */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-neutral-400 transition-colors"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}