import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
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
      { $inc: { paid_fee: + Number(fee) } }
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
