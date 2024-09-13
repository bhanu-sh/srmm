import { connect } from "@/dbConfig/dbConfig";
import { Student } from "@/models";
import { Course } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function PUT(request: NextRequest) {
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
        // Initialize students array if undefined
        oldCourse.students = oldCourse.students || [];
        oldCourse.students = oldCourse.students.filter(
          (student_id: { toString: () => any }) => student_id.toString() !== _id
        );

        await oldCourse.save();
      }

      if (newCourse) {
        // Initialize students array if undefined
        newCourse.students = newCourse.students || [];
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
