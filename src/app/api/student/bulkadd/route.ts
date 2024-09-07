import { connect } from "@/dbConfig/dbConfig";
import { Student, Course } from "@/models";
import { Fee } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { user, course_id } = reqBody;

    if (!Array.isArray(user) || user.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty Student array provided" },
        { status: 400 }
      );
    }

    const checkCourse = await Course.findById(course_id);
    if (!checkCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseName = checkCourse.name;

    const results = [];

    for (const student of user) {
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
        date_of_admission,
        fee_submitted,
      } = student;

      try {
        if (
          !phone ||
          typeof phone !== "string" ||
          !password ||
          typeof password !== "string"
        ) {
          results.push({
            phone,
            status: "error",
            message: "Invalid phone or password format",
          });
          continue;
        }

        // Generate roll number based on course
        const newRoll = `SRMM${courseName
          .split(" ")[0]
          .replace(/\s/g, "")
          .replace(/\./g, "")
          .toUpperCase()}${roll}`;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [day, month, year] = date_of_admission.split("/");
        const parsedDateOfAdmission = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );

        // Create new student
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
          course: course_id,
          date_of_admission: parsedDateOfAdmission,
        });

        // Save student
        const savedStudent = await newStudent.save();

        console.log("Saved student:", savedStudent);

        // Generate receipt number and create course fee
        const receipt_no = (await Fee.countDocuments({})) + 1;
        const newFee = new Fee({
          name: "Course Fee",
          description: "Course Fee",
          amount: checkCourse.course_fee,
          type: "fee",
          receipt_no,
          student_id: savedStudent._id,
        });

        await newFee.save();

        // Create admission fee
        const newAdmissionFee = new Fee({
          name: "Admission Fee",
          description: "Admission Fee",
          amount: fee_submitted,
          type: "received",
          receipt_no: receipt_no + 1,
          student_id: savedStudent._id,
        });

        await newAdmissionFee.save();

        savedStudent.fees.push(newFee._id);
        await savedStudent.save();

        // Associate student with course
        checkCourse.students.push(savedStudent._id);
        await checkCourse.save();

        results.push({
          phone,
          status: "success",
          message: "Student created successfully",
          savedStudent,
        });
      } catch (error: any) {
        results.push({
          phone,
          status: "error",
          message: error.message,
        });
      }
    }

    return NextResponse.json({
      message: "Student processing completed",
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
