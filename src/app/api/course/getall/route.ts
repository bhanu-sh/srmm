export const dynamic = 'force-dynamic';

import { connect } from "@/dbConfig/dbConfig";
import { Course } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const courses = await Course.find();
    const response = NextResponse.json({ data: courses });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
