import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (req.nextauth.token?.role === "Admin") {
      return NextResponse.next();
    } else {
      if (
        (req.nextUrl.pathname.startsWith("/add/college") ||
          req.nextUrl.pathname.startsWith("/add/staff")) &&
        req.nextauth.token?.role !== "CollegeAdmin"
      ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      if (
        req.nextUrl.pathname.startsWith("/colleges") &&
        req.nextauth.token?.role !== "Admin"
      ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/add/:path*",
    "/courses/:path*",
    "/expenses/:path*",
    "/fees/:path*",
    "/staffs/:path*",
    "/students/:path*",
    "/api/student/:path*",
    "/api/course/:path*",
    "/api/expense/:path*",
    "/api/fee/:path*",
  ],
};
