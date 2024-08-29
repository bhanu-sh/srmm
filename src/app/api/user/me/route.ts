import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

connect();

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret });
    if (!token) {
      return NextResponse.json(
        { error: "You must be signed in to view the page" },
        { status: 401 }
      );
    }
    const { _id } = token;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await User.findById({ _id }).select("-password");
    return NextResponse.json({
      message: "User Found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
