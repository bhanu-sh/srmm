import { connect } from "@/dbConfig/dbConfig";
import { Student } from "@/models";
import { Course } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, ...rest } = reqBody;

    if (!_id) {
      return NextResponse.json(
        { error: "Student ID not provided" },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ _id });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (rest.course) {
      const oldCourse = await Course.findOne({ _id: student.course });
      const newCourse = await Course.findOne({ _id: rest.course });

      if (oldCourse) {
        oldCourse.students = oldCourse.students.filter(
          (student_id: { toString: () => any }) => student_id.toString() !== _id
        );

        await oldCourse.save();
      }

      if (newCourse) {
        newCourse.students.push(_id);
        await newCourse.save();
      }
    }

    await Student.updateOne({ _id }, rest);

    return NextResponse.json({ message: "Student updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
