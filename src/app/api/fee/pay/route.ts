import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
import Student from "@/models/studentModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  connect();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
