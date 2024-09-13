export const dynamic = "force-dynamic";

import { connect } from "@/dbConfig/dbConfig";
import { Student } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await Student.find().populate("course");
    const response = NextResponse.json({ data: students });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
