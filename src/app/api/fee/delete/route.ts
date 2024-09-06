import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { fee_id } = reqBody;

    if (!fee_id) {
      return NextResponse.json(
        { error: "Fee ID is required" },
        { status: 400 }
      );
    }

    const feeExist = await Fee.findById(fee_id);

    if (!feeExist) {
      return NextResponse.json(
        { error: "Fee does not exist" },
        { status: 404 }
      );
    }

    await Fee.deleteOne({ _id: fee_id });

    return NextResponse.json({ message: "Fee deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
