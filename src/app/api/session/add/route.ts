import { connect } from "@/dbConfig/dbConfig";
import { Session } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { start, end, course } = reqBody;

    console.log(reqBody);

    // Create new Session
    const newSession = new Session({
      start,
      end,
      course,
      students: [],
    });

    // Save Session
    const savedSession = await newSession.save();
    console.log(savedSession);

    return NextResponse.json({
      message: "Session created successfully",
      success: true,
      savedSession,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
