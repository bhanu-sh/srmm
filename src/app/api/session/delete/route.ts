import { connect } from "@/dbConfig/dbConfig";
import { Session } from "@/models";
import { Student } from "@/models";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { session_id } = reqBody;

    await Session.findByIdAndDelete(session_id);

    const students = await Student.find({ session: session_id });

    for (const student of students) {
      student.session = null;
      await student.save();
    }

    return NextResponse.json({
      message: `Session deleted successfully`,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
