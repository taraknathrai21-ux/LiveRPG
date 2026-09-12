import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;
const hasValidClerkKeys = Boolean(
  publishableKey &&
  secretKey &&
  !publishableKey.includes("your_clerk") &&
  !publishableKey.includes("pk_test_your")
);

export default hasValidClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      const { pathname } = request.nextUrl;
      const authData = await auth();

      const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");

      const sessionCookie = request.cookies.get("arcane_session")?.value;

      // If already logged in, redirect away from login/sign-up to main home page
      if ((authData.userId || sessionCookie) && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      const isPublicRoute =
        pathname === "/" ||
        isAuthRoute ||
        pathname.startsWith("/sso-callback") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/webhooks");

      if (!isPublicRoute) {
        await auth.protect();
      }
    })
  : (request: NextRequest) => {
      const { pathname } = request.nextUrl;
      const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");
      const sessionCookie = request.cookies.get("arcane_session")?.value;

      if (sessionCookie && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
