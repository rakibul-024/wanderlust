import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-utile-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Wanderlust",
  description: "Discover Your Next Adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${urbanist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Navbar reads the pathname for active links, which can't be resolved
            while prerendering dynamic routes — Suspense keeps the shell static. */}
        <Suspense fallback={<div className="h-[72px]" aria-hidden="true" />}>
          <Navbar />
        </Suspense>
        {children}
        <Footer></Footer>

      </body>
    </html>
  );
}