import { connect } from "@/dbConfig/dbConfig";
import Expense from "@/models/expenseModel";
import College from "@/models/collegeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, description, amount, type, college_id, date } = reqBody;

    console.log(reqBody);

    const college = await College.findById(college_id);

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Create new Expense
    const newExpense = new Expense({
      name,
      description,
      amount,
      type: type === "" ? "sent" : type,
      college_id,
      date: date === "" ? new Date() : date,
    });

    // Save Expense
    const savedExpense = await newExpense.save();
    console.log(savedExpense);

    // Add Expense to College
    college.expenses.push(savedExpense._id);
    await college.save();

    return NextResponse.json({
      message: "Fee created successfully",
      success: true,
      savedExpense,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
