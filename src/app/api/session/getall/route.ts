import { connect } from "@/dbConfig/dbConfig";
import { Session } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const sessions = await Session.find();
    return NextResponse.json({ data: sessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
