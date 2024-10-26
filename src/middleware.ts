import type {
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
} from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "~/env";

const shouldUseClerk = Boolean(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function handleClerkMiddleware(request: NextRequest, event: NextFetchEvent) {
  return clerkMiddleware(() => NextResponse.next())(request, event);
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return shouldUseClerk
    ? handleClerkMiddleware(request, event)
    : NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/", "/((?!_next|_vercel|.*\\..*).*)"],
};

/* import type { MiddlewareConfig } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const createClerkMiddleware = clerkMiddleware();

export default middleware((request, event) => {
  return createClerkMiddleware(request, event);
});
; */

/* import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const url = new URL(req.nextUrl.origin);

    auth().protect({
      unauthenticatedUrl: `${url.origin}/signin`,
      unauthorizedUrl: `${url.origin}/dashboard/stores`,
    });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
 */
