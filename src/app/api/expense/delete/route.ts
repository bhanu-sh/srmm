import { connect } from "@/dbConfig/dbConfig";
import Expense from "@/models/expenseModel";
import College from "@/models/collegeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { expense_id, college_id } = await request.json();

    if (!expense_id || !college_id) {
      return NextResponse.json(
        { error: "Invalid or empty Expense ID or College ID provided" },
        { status: 400 }
      );
    }

    const college = await College.findById(college_id);

    if (!college) {
      return NextResponse.json(
        { error: "College not found with provided ID" },
        { status: 404 }
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

    college.expenses = college.expenses.filter(
      (exp: string) => exp !== expense_id
    );

    await college.save();

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
