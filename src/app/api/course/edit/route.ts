import { connect } from "@/dbConfig/dbConfig";
import { Course } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, ...rest } = reqBody;

    if (!_id) {
      return NextResponse.json(
        { error: "Course ID not provided" },
        { status: 400 }
      );
    }

    const course = await Course.findById(_id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await Course.updateOne({ _id }, rest as any);

    return NextResponse.json({ message: "Course updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
