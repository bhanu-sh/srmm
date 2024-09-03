export { default } from "next-auth/middleware";

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
