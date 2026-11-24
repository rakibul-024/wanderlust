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

const EditDestinationPage = () => {
  // Reusable soft input styling without hard black focus rings
  const softInputClass =
    "bg-[#F5F5F5] border border-transparent rounded-none h-11 text-sm text-neutral-800 shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-neutral-300";

  return (
    <Dialog>
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

      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto bg-white p-6 md:p-8 rounded-none border-neutral-200">
        <form>
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
              <Input
                id="destinationName"
                name="destinationName"
                defaultValue="Bali Paradise"
                className={softInputClass}
              />
            </Field>

            {/* Country & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="country" className="text-xs text-neutral-700">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue="Indonesia"
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
                  defaultValue="Beach"
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

            {/* Price (USD) & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="price" className="text-xs text-neutral-700">
                  Price (USD)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
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
                placeholder="Describe the travel experience..."
                className="w-full bg-[#F5F5F5] border border-transparent p-3 text-sm text-neutral-800 resize-none focus:outline-none focus:ring-0 focus:border-neutral-300"
              />
            </Field>
          </FieldGroup>

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
              className="bg-[#0097B2] hover:bg-[#008299] text-white rounded-none"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDestinationPage;