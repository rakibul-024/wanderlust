import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/mongodb";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_PHOTO_BYTES + 64 * 1024;
const FALLBACK_PHOTO = "/images/traveler-2.png";

type PhotoContentType = "image/jpeg" | "image/png" | "image/webp";

interface ProfilePhoto {
  _id: string;
  contentType: PhotoContentType;
  data: Buffer;
  updatedAt: Date;
}

const profilePhotos = db.collection<ProfilePhoto>("profilePhotos");

function getImageType(data: Uint8Array): PhotoContentType | null {
  if (
    data.length >= 8 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47 &&
    data[4] === 0x0d &&
    data[5] === 0x0a &&
    data[6] === 0x1a &&
    data[7] === 0x0a
  ) {
    return "image/png";
  }

  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    data.length >= 12 &&
    String.fromCharCode(...data.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...data.slice(8, 12)) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const photo = await profilePhotos.findOne({ _id: session.user.id });
  const headersForPhoto = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  };

  if (!photo) {
    return NextResponse.redirect(new URL(FALLBACK_PHOTO, request.url), {
      headers: headersForPhoto,
    });
  }

  return new Response(new Uint8Array(photo.data), {
    headers: {
      ...headersForPhoto,
      "Content-Type": photo.contentType,
      "Content-Length": String(photo.data.length),
    },
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Photo must be 5 MB or smaller." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
  }

  const file = formData.get("photo");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ error: "Photo must be between 1 byte and 5 MB." }, { status: 400 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  const contentType = getImageType(data);
  if (!contentType || (file.type && file.type !== contentType)) {
    return NextResponse.json(
      { error: "Choose a valid JPEG, PNG, or WebP image." },
      { status: 415 }
    );
  }

  await profilePhotos.updateOne(
    { _id: session.user.id },
    {
      $set: {
        contentType,
        data,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
