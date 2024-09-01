import { connect } from "@/dbConfig/dbConfig";
import Expense from "@/models/expenseModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { expense_id } = await request.json();

    if (!expense_id) {
      return NextResponse.json(
        { error: "Invalid or empty Expense ID or College ID provided" },
        { status: 400 }
      );
    }

    const expense = await Expense.findById(expense_id);

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found with provided ID" },
        { status: 404 }
      );
    }

    await Expense.findByIdAndDelete(expense_id);

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
