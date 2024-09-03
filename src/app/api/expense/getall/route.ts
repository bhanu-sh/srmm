import { connect } from "@/dbConfig/dbConfig";
import { Expense } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  
  try {
    const expenses = await Expense.find();
    return NextResponse.json({ data: expenses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
