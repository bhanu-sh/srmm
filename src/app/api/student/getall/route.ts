import { connect } from "@/dbConfig/dbConfig";
import { Student } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  
  try {
    const students = await Student.find().populate("course");
    return NextResponse.json({ data: students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
