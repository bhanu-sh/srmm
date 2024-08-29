import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (req.nextauth.token?.role === "Admin") {
      return NextResponse.next();
    } else {
      if (
        (req.nextUrl.pathname.startsWith("/dashboard/add/college") ||
          req.nextUrl.pathname.startsWith("/dashboard/add/staff")) &&
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
    "/dashboard/:path*",
    "/colleges/:path*",
    "/add/:path*",
    "/api/user/getall",
    "/api/user/admin/getall",
    "/api/college/getbyid",
    "/api/user/student/getbycollege",
    "/api/college/:path*",
    "/",
  ],
};
