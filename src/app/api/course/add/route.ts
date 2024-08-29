import { connect } from "@/dbConfig/dbConfig";
import Course from "@/models/courseModel";
import College from "@/models/collegeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, duration, college_id } = reqBody;

    console.log(reqBody);

    const college = await College.findById(college_id);

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Create new Course
    const newCourse = new Course({
      name,
      duration,
      college_id,
      students: [],
    });

    // Save Course
    const savedCourse = await newCourse.save();
    console.log(savedCourse);

    return NextResponse.json({
      message: "Fee created successfully",
      success: true,
      savedCourse,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
