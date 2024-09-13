import { NextRequest, NextResponse } from "next/server";
import Student from "@/models/studentModel";
import { connect } from "@/dbConfig/dbConfig";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  connect();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    console.log("id:", id);

    if (!id) {
      return NextResponse.json(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    const user = await Student.findOne({ _id: id }).populate("course");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User Found",
      data: user,
    });
  } catch (error: any) {
    console.error("Error finding user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
