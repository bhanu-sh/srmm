import { connect } from "@/dbConfig/dbConfig";
import Course from "@/models/courseModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, session_start, session_end } = reqBody;

    console.log(reqBody);

    // Create new Course
    const newCourse = new Course({
      name,
      session_start,
      session_end,
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
