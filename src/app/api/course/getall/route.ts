import { connect } from "@/dbConfig/dbConfig";
import { Course } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const courses = await Course.find();
    return NextResponse.json({ data: courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
