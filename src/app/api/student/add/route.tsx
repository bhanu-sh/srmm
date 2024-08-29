import { connect } from "@/dbConfig/dbConfig";
import { Student } from "@/models";
import { Fee } from "@/models";
import { Course } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      f_name,
      l_name,
      father_name,
      mother_name,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      password,
      roll,
      aadhar,
      course,
      session_start_year,
      session_end_year,
      college_id,
    } = reqBody;

    console.log(reqBody);

    // Check if Student already exists
    const student = await Student.findOne({ phone });

    if (student) {
      return NextResponse.json(
        { error: "Student already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password ? password : "123", salt);

    // Create new Student
    const newStudent = new Student({
      f_name,
      l_name,
      father_name,
      mother_name,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      college_id: college_id,
      password: hashedPassword,
      role: "Student",
      roll_no: roll,
      aadhar,
      course,
      session_start_year,
      session_end_year,
    });

    const savedStudent = await newStudent.save();

    const course_receipt_no = (await Fee.countDocuments({})) + 1;
    // Create new Fee
    const newCourseFee = new Fee({
      name: "Course Fee",
      description: "Course Fee",
      amount: 0,
      type: "fee",
      receipt_no: course_receipt_no,
      college_id,
      student_id: savedStudent._id,
    });
    await newCourseFee.save();

    const paid_receipt_no = (await Fee.countDocuments({})) + 1;

    const newPaidFee = new Fee({
      name: "Paid Fee",
      description: "Paid Fee",
      amount: 0,
      receipt_no: paid_receipt_no,
      type: "received",
      college_id,
      student_id: savedStudent._id,
    });
    await newPaidFee.save();

    savedStudent.fees.push(newCourseFee._id, newPaidFee._id);
    await savedStudent.save();

    // Update Course
    const courseDetails = await Course.findOne({_id: course});
    courseDetails.students.push(savedStudent._id);

    await courseDetails.save();

    return NextResponse.json({
      message: "Student addedd successfully",
      success: true,
      savedStudent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
