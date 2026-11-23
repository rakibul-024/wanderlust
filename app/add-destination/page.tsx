"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";

const CATEGORIES = ["Beach", "Mountain", "Adventure", "Cultural", "City Tour"];

const AddDestinationPage = () => {
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form data:", data);

    const response = await fetch("http://localhost:5000/add-destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("after submission:", result);

    // if (result.success) {
    //   router.push("/destinations");
    // }
  };

  return (
    <div className="min-h-screen bg-white px-6 pb-24 pt-28 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <h1 className="mb-12 text-3xl font-normal tracking-tight text-slate-800 sm:text-4xl">
          Add New Travel Package
        </h1>

        {/* Form Card */}
        <div className="mx-auto max-w-3xl rounded-sm border border-slate-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-12">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Destination Name */}
            <div>
              <label
                htmlFor="destinationName"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Destination Name
              </label>
              <input
                id="destinationName"
                type="text"
                name="destinationName"
                placeholder="Bali Paradise"
                required
                className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
              />
            </div>

            {/* Country & Category */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="Indonesia"
                  required
                  className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue="Beach"
                  className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Price (USD)
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  min={0}
                  step="any"
                  placeholder="e.g., 1299"
                  required
                  className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Duration
                </label>
                <input
                  id="duration"
                  type="text"
                  name="duration"
                  placeholder="e.g., 7 Days/6 Nights"
                  required
                  className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div>
              <label
                htmlFor="departureDate"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Departure Date
              </label>
              <input
                id="departureDate"
                type="date"
                name="departureDate"
                required
                className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                required
                className="w-full rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe the travel experience..."
                required
                className="w-full resize-none rounded-sm bg-[#F4F6F8] px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-[#00A8D6]/40"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3.5 pt-4">
              <button
                type="reset"
                className="inline-flex items-center gap-1.5 rounded-sm border border-red-300 bg-white px-5 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-sm bg-[#00A8D6] px-6 py-2.5 text-xs font-medium text-white transition hover:bg-[#0092ba]"
              >
                <Save className="h-3.5 w-3.5" />
                Add Travel Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDestinationPage;