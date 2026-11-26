import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { db } from "@/lib/mongodb";

const bookings = db.collection("bookings");

async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * List bookings visible to the current visitor.
 * Signed-in users see their own bookings plus guest bookings;
 * guests only see guest bookings. Cancelled bookings are kept in the
 * database as a record but hidden from the list.
 */
export async function GET() {
  const userId = await getCurrentUserId();
  const notCancelled = { status: { $ne: "Cancelled" } };
  const filter = userId
    ? { $or: [{ userId }, { userId: null }], ...notCancelled }
    : { userId: null, ...notCancelled };

  const list = await bookings.find(filter).sort({ bookedAt: -1 }).toArray();
  return NextResponse.json(list);
}

/** Create a booking (attaches the signed-in user when there is one). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const destinationName = String(body.destinationName ?? "").trim();
  if (!destinationName) {
    return NextResponse.json({ error: "destinationName is required" }, { status: 400 });
  }

  const userId = await getCurrentUserId();

  const doc = {
    destinationId: String(body.destinationId ?? ""),
    destinationName,
    country: String(body.country ?? ""),
    price: Number(body.price) || 0,
    duration: Number(body.duration) || 0,
    imageUrl: String(body.imageUrl ?? ""),
    travelDate: String(body.travelDate ?? ""),
    // Guest bookings stay pending until they are tied to an account.
    status: userId ? "Confirmed" : "Pending",
    bookedAt: new Date().toISOString(),
    ...(userId ? { userId } : {}),
  };

  const result = await bookings.insertOne(doc);
  return NextResponse.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 });
}

/** Update a booking's status (used by the Cancel action). */
export async function PATCH(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = String(body.id ?? "");
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  const userId = await getCurrentUserId();
  const _id = new ObjectId(id);

  const existing = await bookings.findOne({ _id });
  if (!existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const owner = existing.userId as string | undefined;
  if (owner && owner !== userId) {
    return NextResponse.json({ error: "Not allowed to modify this booking" }, { status: 403 });
  }

  const requested = String(body.status ?? "Cancelled");
  const status = ["Pending", "Confirmed", "Cancelled"].includes(requested)
    ? requested
    : "Cancelled";

  await bookings.updateOne({ _id }, { $set: { status } });
  return NextResponse.json({ ok: true, status });
}
