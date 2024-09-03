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
  ],
};
