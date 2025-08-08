import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const verified = token ? verifyToken(token) : null;

    const url = request.nextUrl;

    const isAuth = Boolean(verified);

    const publicRoutes = ["/", "/login", "/register"];
    if (isAuth && publicRoutes.includes(url.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", url));
    }

    const protectedRoutes = ["/dashboard", "/admin"];
    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

    if (!isAuth && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", url));
    }

    if (url.pathname.startsWith("/admin") && verified?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
