import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  connect();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reqBody = await request.json();
    const { id, fee } = reqBody;

    console.log(reqBody);

    // Check if User exists
    const user = await User.findOne({ _id: id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Update User
    const updated = await User.updateOne(
      { _id: id },
      { $inc: { paid_fee: +Number(fee) } }
    );

    console.log(updated);

    return NextResponse.json({
      message: "Fee paid successfully",
      success: true,
      updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
