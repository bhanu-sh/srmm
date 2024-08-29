import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
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
