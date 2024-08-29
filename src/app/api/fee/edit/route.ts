import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, ...rest } = reqBody;

    if (!_id) {
      return NextResponse.json(
        { error: "Fee ID not provided" },
        { status: 400 }
      );
    }

    const fee = await Fee.findById(_id);

    if (!fee) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    //dont change empty fields
    for (const key in rest) {
      if (!rest[key]) {
        delete rest[key];
      }
    }

    await Fee.findByIdAndUpdate(_id, rest);

    return NextResponse.json({ message: "Fee updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
