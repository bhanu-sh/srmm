import { connect } from "@/dbConfig/dbConfig";
import { Student, Course } from "@/models";
import { Fee } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      name,
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
      date_of_admission,
    } = reqBody;

    console.log(reqBody);

    const courseData = await Course.findById(course);
    const courseName = courseData.name;

    console.log(courseName);

    const newRoll = `SRMM${courseName.toUpperCase()}${roll}`;

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
      name,
      father_name,
      mother_name,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      password: hashedPassword,
      role: "Student",
      roll_no: newRoll,
      aadhar,
      course,
      date_of_admission,
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
      student_id: savedStudent._id,
    });
    await newCourseFee.save();

    savedStudent.fees.push(newCourseFee._id);

    await savedStudent.save();

    return NextResponse.json({
      message: "Student addedd successfully",
      success: true,
      savedStudent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
