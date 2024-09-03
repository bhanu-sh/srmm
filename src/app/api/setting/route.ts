import { connect } from "@/dbConfig/dbConfig";
import { Setting } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const settings = await Setting.findOne();
    return NextResponse.json({ data: settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
