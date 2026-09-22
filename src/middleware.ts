import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// NOTE: this middleware only prevents unauthenticated users from *loading*
// protected pages, for UX. It is NOT the source of truth for authorization —
// every server action / route handler under (customer) and admin/ must
// independently re-check the session and role. See src/lib/authorize.ts.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/checkout");

  if (isAdminRoute && (!isLoggedIn || !["ADMIN", "SUPER_ADMIN", "STAFF"].includes(role ?? ""))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isCustomerRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/orders/:path*", "/wishlist/:path*", "/checkout/:path*"],
};
