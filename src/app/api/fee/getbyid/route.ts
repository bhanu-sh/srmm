import { NextRequest, NextResponse } from "next/server";
import { Fee } from "@/models";
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

    const user = await Fee.findById(id)
      .populate("student_id", "f_name l_name course")
      .populate("college_id", "name address city state pincode contact email image");

    if (!user) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Fee Found",
      data: user,
    });
  } catch (error: any) {
    console.error("Error finding Fee details:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
