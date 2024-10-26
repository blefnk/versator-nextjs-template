import type {
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
} from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { createRouteMatcher } from "@clerk/nextjs/server";

// Check if Clerk middleware should be used
// const shouldUseClerk = Boolean(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const shouldUseClerk = true; // TODO: temporary
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

function handleClerkMiddleware(request: NextRequest, event: NextFetchEvent) {
  return clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) {
      const url = new URL(req.nextUrl.origin);

      auth().protect({
        unauthenticatedUrl: `${url.origin}/signin`,
        unauthorizedUrl: `${url.origin}/dashboard/stores`,
      });
    }
    return NextResponse.next();
  })(request, event);
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return shouldUseClerk
    ? handleClerkMiddleware(request, event)
    : NextResponse.next();
}

// Middleware will not run on Next.js internals, static files, and API routes
export const config: MiddlewareConfig = {
  matcher: [
    // Match all routes except:
    // - Next.js internals (_next)
    // - Static files with specific extensions
    // Always include API routes (/api, /trpc)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
