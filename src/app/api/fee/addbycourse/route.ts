import { connect } from "@/dbConfig/dbConfig";
import { Fee } from "@/models";
import { Student } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { course, college_id, name, amount } = reqBody;

    const students = await Student.find({ college_id }).populate("course");

    const filteredStudents = students.filter(
      (student) => student.course.name === course
    );

    for (const student of filteredStudents) {
      const fee = new Fee({
        college_id,
        student_id: student._id,
        name,
        amount,
        type: "fee",
        receipt_no: Math.floor(100000 + Math.random() * 900000),
      });

      await fee.save();

      student.fees.push(fee._id);

      await student.save();
    }

    const savedFee = await Fee.find({ course });

    return NextResponse.json({
      message: `Fee created for all students of course ${course} successfully`,
      success: true,
      savedFee,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
