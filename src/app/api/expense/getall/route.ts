export const dynamic = 'force-dynamic';

import { connect } from "@/dbConfig/dbConfig";
import { Expense } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const expenses = await Expense.find();
    const response = NextResponse.json({ data: expenses });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
