import { connect } from "@/dbConfig/dbConfig";
import Student from "@/models/studentModel";
import Fee from "@/models/feeModel";
import Course from "@/models/courseModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("Request body:", reqBody);
    const { user } = reqBody;

    if (!Array.isArray(user) || user.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty User array provided" },
        { status: 400 }
      );
    }

    const results = [];

    for (const user_id of user) {
      try {
        const userExist = await Student.findOne({ _id: user_id });

        if (!userExist) {
          results.push({
            user_id,
            status: "error",
            message: "User does not exist",
          });
          continue;
        }

        //delete fee records of the student
        await Fee.deleteMany({ student_id: user_id });

        const courses = await Course.find({ students: user_id });
        for (const course of courses) {
          course.students = course.students.filter(
            (student_id: { toString: () => any }) =>
              student_id.toString() !== user_id
          );
          await course.save();
        }

        await Student.deleteOne({ _id: user_id });

        results.push({
          user_id,
          status: "success",
          message: "User deleted successfully",
        });
      } catch (error: any) {
        results.push({
          user_id,
          status: "error",
          message: error.message,
        });
      }
    }

    return NextResponse.json({ data: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
