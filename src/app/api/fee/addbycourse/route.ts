import { connect } from "@/dbConfig/dbConfig";
import { Fee } from "@/models";
import { Student } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { course, name, amount } = reqBody;

    const students = await Student.find().populate("course");

    const filteredStudents = students.filter(
      (student) => student.course.name === course
    );

    for (const student of filteredStudents) {
      const fee = new Fee({
        receipt_no: (await Fee.countDocuments({})) + 1,
        name,
        amount,
        type: "fee",
        student_id: student._id,
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
