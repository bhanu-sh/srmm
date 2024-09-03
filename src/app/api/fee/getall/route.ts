export const dynamic = 'force-dynamic';

import { connect } from "@/dbConfig/dbConfig";
import { Fee } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const fees = await Fee.find().populate({
      path: "student_id",
      populate: {
        path: "course",
      },
    });
    const response = NextResponse.json({ data: fees });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
