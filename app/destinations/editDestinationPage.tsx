"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, SquarePen, Trash2 } from "lucide-react";

// Define the structure of a Destination object
interface Destination {
  _id?: string;
  destinationName: string;
  country: string;
  category: string;
  price: number | string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
}

const EditDestinationPage = () => {
  // Get the destination ID from URL parameters safely as a string
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Store fetched destination data in state
  const [form, setForm] = useState<Destination | null>(null);
  // Control dialog modal open/close state
  const [open, setOpen] = useState<boolean>(false);

  // Fetch existing destination details when component mounts
  useEffect(() => {
    if (!id) return;

    const fetchDestination = async () => {
      try {
        const res = await fetch(`http://localhost:5000/destination/${id}`);
        if (!res.ok) {
          console.error(`GET Error (${res.status}):`, await res.text());
          return;
        }
        // Unknown IDs come back as 200 with an empty body — only parse when there is content.
        const raw = await res.text();
        if (!raw) return;
        const data: Destination = JSON.parse(raw);
        setForm(data);
      } catch (error) {
        console.error("Failed to fetch destination:", error);
      }
    };

    fetchDestination();
  }, [id]);

  // Update individual form fields dynamically
  const update = (field: keyof Destination, value: string | number) => {
    setForm((current) => (current ? { ...current, [field]: value } : null));
  };

  // Submit updated destination data to the backend
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !id) return;

    // Remove _id via destructuring so MongoDB does not update an immutable field
    const { _id, ...updatedData } = form;
    void _id;

    try {
      const res = await fetch(`http://localhost:5000/destination/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      // Check if response is actually JSON before parsing
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        const errorHtml = await res.text();
        console.error(`PATCH Error (${res.status}):`, errorHtml);
        alert("Server error! Check your backend terminal or console.");
        return;
      }

      const data = await res.json();
      console.log("Update response:", data);

      // Close modal and reload page if update succeeds
      if (data.modifiedCount > 0 || data.matchedCount > 0) {
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update destination:", error);
    }
  };

  // Reusable Tailwind styling for borderless form inputs
  const softInputClass =
    "bg-[#F5F5F5] border border-transparent rounded-none h-11 text-sm text-neutral-800 shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-neutral-300";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button to trigger the edit dialog */}
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5 text-neutral-700" />
            <span>Edit</span>
          </button>
        }
      />

      {/* Dialog modal container */}
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto bg-white p-6 md:p-8 rounded-none border-neutral-200">
        <form onSubmit={handleSubmit}>
          {/* Modal header */}
          <DialogHeader className="text-left mb-4">
            <DialogTitle className="font-serif text-2xl font-normal text-neutral-900">
              Update Travel Package
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Make changes to the travel package details below
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            {/* Destination Name */}
            <Field>
              <Label
                htmlFor="destinationName"
                className="text-xs text-neutral-700"
              >
                Destination Name
              </Label>
              <Input
                id="destinationName"
                name="destinationName"
                value={form?.destinationName || ""}
                onChange={(e) => update("destinationName", e.target.value)}
                className={softInputClass}
              />
            </Field>

            {/* Country and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="country" className="text-xs text-neutral-700">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={form?.country || ""}
                  onChange={(e) => update("country", e.target.value)}
                  className={softInputClass}
                />
              </Field>

              <Field>
                <Label htmlFor="category" className="text-xs text-neutral-700">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={form?.category || "Beach"}
                  onChange={(e) => update("category", e.target.value)}
                  className={`w-full px-3 ${softInputClass}`}
                >
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="City">City</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </Field>
            </div>

            {/* Price (USD) and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="price" className="text-xs text-neutral-700">
                  Price (USD)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form?.price || ""}
                  onChange={(e) => update("price", Number(e.target.value))}
                  placeholder="e.g., 1299"
                  className={softInputClass}
                />
              </Field>

              <Field>
                <Label htmlFor="duration" className="text-xs text-neutral-700">
                  Duration
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  value={form?.duration || ""}
                  onChange={(e) => update("duration", e.target.value)}
                  placeholder="e.g., 7 Days/6 Nights"
                  className={softInputClass}
                />
              </Field>
            </div>

            {/* Departure Date */}
            <Field>
              <Label
                htmlFor="departureDate"
                className="text-xs text-neutral-700"
              >
                Departure Date
              </Label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                value={form?.departureDate || ""}
                onChange={(e) => update("departureDate", e.target.value)}
                className={softInputClass}
              />
            </Field>

            {/* Image URL */}
            <Field>
              <Label htmlFor="imageUrl" className="text-xs text-neutral-700">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form?.imageUrl || ""}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={softInputClass}
              />
            </Field>

            {/* Description */}
            <Field>
              <Label
                htmlFor="description"
                className="text-xs text-neutral-700"
              >
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form?.description || ""}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the travel experience..."
                className="w-full bg-[#F5F5F5] border border-transparent p-3 text-sm text-neutral-800 resize-none focus:outline-none focus:ring-0 focus:border-neutral-300"
              />
            </Field>
          </FieldGroup>

          {/* Modal Footer Buttons */}
          <DialogFooter className="mt-6 flex flex-row justify-end gap-3 bg-transparent border-none">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-300 text-red-500 hover:bg-red-50 rounded-none"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              className="bg-[#0097B2] hover:bg-[#008299] text-white rounded-none cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Update Travel Package
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDestinationPage;