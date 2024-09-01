import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/models";
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

    const session = await Session.findById(id);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Session Found",
      data: session,
    });
  } catch (error: any) {
    console.error("Error finding Session details:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
