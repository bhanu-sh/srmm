import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
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
    const { student_id } = reqBody;

    console.log(reqBody);

    if (!student_id) {
      return NextResponse.json(
        { error: "student_id is required" },
        { status: 400 }
      );
    }

    const fees = await Fee.find({ student_id });
    return NextResponse.json({ data: fees });
  } catch (error: any) {
    console.error("Error finding Fee:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
