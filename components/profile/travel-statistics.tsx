"use client";

import { BadgeDollarSign, CalendarCheck2, Plane, TrendingUp } from "lucide-react";

interface TravelStatisticsProps {
  tripsBooked: number;
  countriesVisited: number;
  upcomingTrips: number;
  totalSpent: number;
  loaded: boolean;
}

export function TravelStatistics({
  tripsBooked,
  countriesVisited,
  upcomingTrips,
  totalSpent,
  loaded,
}: TravelStatisticsProps) {
  const stats = [
    {
      label: "Total Bookings",
      value: loaded ? String(tripsBooked) : "—",
      icon: Plane,
      iconStyle: "bg-sky-100 text-sky-500",
    },
    {
      label: "Countries Visited",
      value: loaded ? String(countriesVisited) : "—",
      icon: CalendarCheck2,
      iconStyle: "bg-emerald-100 text-emerald-500",
    },
    {
      label: "Upcoming Trips",
      value: loaded ? String(upcomingTrips) : "—",
      icon: TrendingUp,
      iconStyle: "bg-red-100 text-red-400",
    },
    {
      label: "Total Spent",
      value: loaded ? `$${totalSpent.toLocaleString()}` : "—",
      icon: BadgeDollarSign,
      iconStyle: "bg-violet-100 text-violet-500",
    },
  ];

  return (
    <section>
      <h2 className="text-[13px] font-semibold text-slate-800">Travel Statistics</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, icon: Icon, iconStyle }) => (
          <article
            key={label}
            className="flex h-[75px] items-center justify-between rounded-[9px] border border-slate-100 bg-slate-50/80 px-4"
          >
            <div>
              <p className="text-[10px] text-slate-500">{label}</p>
              <p className="mt-2 text-[16px] font-bold leading-none text-slate-900">{value}</p>
            </div>
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconStyle}`}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
