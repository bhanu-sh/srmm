export const dynamic = 'force-dynamic';

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  
  try {
    const users = await User.find();
    const response = NextResponse.json({ data: users });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}