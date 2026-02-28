import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
);

async function verifyTokenEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/login") {
    const token = req.cookies.get("authToken")?.value;
    if (token) {
      const decoded = await verifyTokenEdge(token);
      if (decoded) {
        const redirectPath = (decoded as any).role === "manager" ? "/dashboard/manager" : "/dashboard/user";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname === "/api/auth/me" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const decoded = await verifyTokenEdge(token);
  if (!decoded) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/entries/:path*", "/api/users/:path*", "/api/auth/me", "/login"],
};