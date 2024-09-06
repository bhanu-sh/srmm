import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
import Student from "@/models/studentModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, date, description, method, amount, student_id } = reqBody;

    console.log(reqBody);

    const student = await Student.findById(student_id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const receipt_no = (await Fee.countDocuments({})) + 1;

    // Create new Fee
    const newFee = new Fee({
      name,
      method,
      type: "received",
      amount,
      date,
      description,
      receipt_no,
      student_id,
    });

    // Save Fee
    const savedFee = await newFee.save();
    console.log(savedFee);

    // Add Fee to Student
    student.fees.push(savedFee._id);
    await student.save();

    return NextResponse.json({
      message: "Fee created successfully",
      success: true,
      savedFee,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
