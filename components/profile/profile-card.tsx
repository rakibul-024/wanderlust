"use client";

import Image from "next/image";
import { Camera, LoaderCircle, MapPin, Pencil } from "lucide-react";
import { cn } from "cn";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileCardProps {
  name: string;
  memberSince: string | null;
  photoUrl: string;
  photoUploading: boolean;
  editing: boolean;
  nameValue: string;
  saving: boolean;
  notice: { kind: "ok" | "err"; text: string } | null;
  onPhotoSelected: (file: File) => void;
  onEdit: () => void;
  onNameChange: (value: string) => void;
  onSave: (event: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProfileCard({
  name,
  memberSince,
  photoUrl,
  photoUploading,
  editing,
  nameValue,
  saving,
  notice,
  onPhotoSelected,
  onEdit,
  onNameChange,
  onSave,
  onCancel,
}: ProfileCardProps) {
  return (
    <aside className="rounded-[10px] border border-slate-100 bg-white px-4 py-5 shadow-[0_8px_24px_-14px_rgba(15,23,42,0.24)]">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-[84px] w-[84px]">
          <Image
            key={photoUrl}
            src={photoUrl}
            alt={`${name}'s profile`}
            fill
            sizes="84px"
            unoptimized
            className="rounded-full object-cover"
          />
          <label
            htmlFor="profilePhoto"
            title="Change profile photo"
            className={cn(
              "absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#0097B2] text-white ring-2 ring-white transition-colors hover:bg-[#008299]",
              photoUploading && "cursor-wait opacity-70"
            )}
          >
            {photoUploading ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={photoUploading}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onPhotoSelected(file);
              event.target.value = "";
            }}
          />
        </div>
        <p className="mt-1 text-[9px] text-slate-400">Click the camera to change photo</p>

        <h2 className="mt-3 text-[16px] font-bold leading-tight text-slate-900">{name}</h2>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" />
          Location not set
        </p>
      </div>

      <div className="mt-5 space-y-3 text-[10px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Member since</span>
          <span className="font-semibold text-slate-800">{memberSince ?? "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Nationality</span>
          <span className="font-semibold text-slate-800">Not set</span>
        </div>
      </div>

      {editing ? (
        <form onSubmit={onSave} className="mt-4 space-y-2.5">
          <div className="space-y-1">
            <Label htmlFor="profileName" className="text-[10px] text-slate-600">
              Display name
            </Label>
            <Input
              id="profileName"
              value={nameValue}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={60}
              className="h-9 rounded-md text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              disabled={saving || !nameValue.trim()}
              className="inline-flex h-9 items-center justify-center gap-1 rounded-[4px] bg-[#0097B2] text-[11px] font-semibold text-white disabled:opacity-60"
            >
              {saving && <LoaderCircle className="h-3 w-3 animate-spin" />}
              {saving ? "Saving" : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="h-9 rounded-[4px] border border-slate-200 text-[11px] font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="mt-5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#0097B2] text-[11px] font-semibold text-white transition-colors hover:bg-[#008299]"
        >
          <Pencil className="h-3 w-3" />
          Edit Profile
        </button>
      )}

      {notice && (
        <p
          role="status"
          className={cn(
            "mt-2 text-center text-[10px] font-medium",
            notice.kind === "ok" ? "text-emerald-600" : "text-red-600"
          )}
        >
          {notice.text}
        </p>
      )}
    </aside>
  );
}
