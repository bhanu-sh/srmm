import { connect } from "@/dbConfig/dbConfig";
import Fee from "@/models/feeModel";
import Student from "@/models/studentModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

connect();

export async function POST(request: NextRequest) {
  try {
    const feePayments: Array<{
      name: string;
      date: string;
      description?: string;
      method: string;
      amount: number;
      student_id: string;
    }> = await request.json();

    if (!Array.isArray(feePayments) || feePayments.length === 0) {
      return NextResponse.json(
        { error: "Invalid input format. Expected a non-empty array." },
        { status: 400 }
      );
    }

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const savedFees = [];

      // Fetch the current count of Fee documents to assign receipt_no
      const currentCount = await Fee.countDocuments().session(session);

      for (let i = 0; i < feePayments.length; i++) {
        const payment = feePayments[i];
        const { name, date, description, method, amount, student_id } = payment;

        // Validate required fields
        if (!student_id || !amount || !date || !method) {
          throw new Error(
            `Missing required fields in fee payment at index ${i}.`
          );
        }

        // Find the student
        const student = await Student.findById(student_id).session(session);
        if (!student) {
          throw new Error(`Student with ID ${student_id} not found.`);
        }

        // Assign receipt_no (assuming sequential numbering)
        const receipt_no = currentCount + i + 1;

        // Create new Fee
        const newFee = new Fee({
          name,
          method,
          type: "received",
          amount,
          date,
          description,
          receipt_no,
          student_id,
        });

        // Save Fee
        const savedFee = await newFee.save({ session });
        savedFees.push(savedFee);

        // Add Fee to Student's fees array
        student.fees.push(savedFee._id);
        await student.save({ session });
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        message: "Bulk fees paid successfully.",
        success: true,
        savedFees,
      });
    } catch (error: any) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: error.message || "Bulk fee payment failed." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid request." },
      { status: 400 }
    );
  }
}
