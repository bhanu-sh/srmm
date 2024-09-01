import { connect } from "@/dbConfig/dbConfig";
import Expense from "@/models/expenseModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, description, amount, type, date } = reqBody;

    console.log(reqBody);

    // Create new Expense
    const newExpense = new Expense({
      name,
      description,
      amount,
      type: type === "" ? "sent" : type,
      date: date === "" ? new Date() : date,
    });

    // Save Expense
    const savedExpense = await newExpense.save();
    console.log(savedExpense);

    return NextResponse.json({
      message: "Fee created successfully",
      success: true,
      savedExpense,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
