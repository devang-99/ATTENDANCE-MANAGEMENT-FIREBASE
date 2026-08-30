import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const currentUser = request.cookies.get("currentUser")?.value;

  const userRole = request.cookies.get("userRole")?.value;

  const pathname = request.nextUrl.pathname;

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !currentUser) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (isDashboard && !userRole) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (pathname === "/dashboard") {
    if (userRole === "student") {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }

    if (userRole === "teacher") {
      return NextResponse.redirect(new URL("/dashboard/teacher", request.url));
    }
  }

  if (pathname.startsWith("/dashboard/teacher") && userRole !== "teacher") {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }

  if (pathname.startsWith("/dashboard/student") && userRole !== "student") {
    return NextResponse.redirect(new URL("/dashboard/teacher", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
