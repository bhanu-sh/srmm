import { connect } from "@/dbConfig/dbConfig";
import Expense from "@/models/expenseModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, name, description, amount } = reqBody;

    console.log(reqBody);

    // Check if Expense exists
    const user = await Expense.findOne({ _id: id });

    if (!user) {
      return NextResponse.json({ error: "Expense not found" }, { status: 400 });
    }

    // Update Expense
    const updated = await Expense.updateOne(
      { _id: id },
      {
        name: name !== "" ? name : user.name,
        description: description !== "" ? description : user.description,
        amount: amount !== "" ? amount : user.amount,
      }
    );

    console.log(updated);

    return NextResponse.json({
      message: "Expense updated successfully",
      success: true,
      updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
