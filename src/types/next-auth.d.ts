import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    role?: string;
    f_name?: string;
    l_name?: string;
    phone?: string;
    avatar?: string;
    isVerified?: boolean;
    college_id?: string;
  }
  interface Session {
    user: {
      _id?: string;
      role?: string;
      f_name?: string;
      l_name?: string;
      phone?: string;
      avatar?: string;
      isVerified?: boolean;
      college_id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    role?: string;
    f_name?: string;
    l_name?: string;
    phone?: string;
    avatar?: string;
    isVerified?: boolean;
    college_id?: string;
  }
}
