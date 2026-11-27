import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

/** Path prefixes that require a signed-in user. */
const PROTECTED_PATHS = [
  "/my-bookings",
  "/add-destination",
  "/profile",
] as const;

/** `/destinations` (list) stays public; only detail routes like `/destinations/[id]` are protected. */
const PROTECTED_DYNAMIC_PREFIXES = ["/destinations"] as const;

function isProtectedPath(pathname: string): boolean {
  if (
    PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return true;
  }

  return PROTECTED_DYNAMIC_PREFIXES.some(
    (prefix) =>
      pathname !== prefix && pathname.startsWith(`${prefix}/`),
  );
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    return session !== null;
  } catch {
    // Never fail open: a broken DB/session lookup means "not signed in".
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (await isAuthenticated(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/my-bookings/:path*",
    "/add-destination/:path*",
    "/profile/:path*",
    "/destinations/:path*",
  ],
};
