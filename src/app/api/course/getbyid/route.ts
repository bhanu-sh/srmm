import { NextRequest, NextResponse } from "next/server";
import Course from "@/models/courseModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    console.log("id:", id);

    if (!id) {
      return NextResponse.json(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Course Found",
      data: course,
    });
  } catch (error: any) {
    console.error("Error finding Course details:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
