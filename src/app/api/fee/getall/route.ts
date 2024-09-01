import { connect } from "@/dbConfig/dbConfig";
import { Fee } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const fees = await Fee.find().populate("student_id");
    return NextResponse.json({ data: fees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
