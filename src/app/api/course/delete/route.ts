import { connect } from "@/dbConfig/dbConfig";
import { Course } from "@/models";
import { Student } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { course_id } = reqBody;

    await Course.findByIdAndDelete(course_id);

    const students = await Student.find({ courses: course_id });

    for (const student of students) {
      student.courses = student.courses.filter(
        (course_id: { toString: () => any }) =>
          course_id.toString() !== course_id
      );
      await student.save();
    }

    return NextResponse.json({
      message: `Course deleted successfully`,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
