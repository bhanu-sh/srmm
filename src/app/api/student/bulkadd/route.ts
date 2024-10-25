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

    // Ensure students is initialized as an array
    if (!Array.isArray(checkCourse.students)) {
      checkCourse.students = [];
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
        if (!phone || typeof phone !== "string" || !password || typeof password !== "string") {
          results.push({
            phone,
            status: "error",
            message: "Invalid phone or password format",
          });
          continue;
        }

        // Check if dob and date_of_admission are defined
        if (!dob || !date_of_admission) {
          results.push({ phone, status: "error", message: "Date of birth or admission date is missing" });
          continue;
        }

        const newRoll = `SRMM${courseName.split(" ")[0].replace(/\s/g, "").replace(/\./g, "").toUpperCase()}${roll}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Parse date_of_admission from "dd/mm/yyyy"
        const [admissionDay, admissionMonth, admissionYear] = date_of_admission.split("/");
        const parsedDateOfAdmission = new Date(
          parseInt(admissionYear),
          parseInt(admissionMonth) - 1,
          parseInt(admissionDay)
        );

        // Parse dob from "dd/mm/yyyy"
        const [dobDay, dobMonth, dobYear] = dob.split("/");
        const parsedDob = new Date(
          parseInt(dobYear),
          parseInt(dobMonth) - 1,
          parseInt(dobDay)
        );

        // Create new student
        const newStudent = new Student({
          name,
          father_name,
          mother_name,
          email,
          phone,
          dob: parsedDob,
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

        // Save student and wait for completion
        const savedStudent = await newStudent.save();

        // Generate receipt number for fees
        const receipt_no = (await Fee.countDocuments({})) + 1;

        // Create course fee
        const newFee = new Fee({
          name: "Course Fee",
          description: "Course Fee",
          amount: checkCourse.course_fee,
          type: "fee",
          receipt_no,
          student_id: savedStudent._id,
        });

        // Save course fee
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

        // Save admission fee
        await newAdmissionFee.save();

        // Update student's fees array in a separate operation
        savedStudent.fees.push(newFee._id);
        await savedStudent.save(); // Await the save

        // Push student ID to course
        checkCourse.students.push(savedStudent._id);
        await checkCourse.save(); // Await the save

        results.push({
          phone,
          status: "success",
          message: "Student created successfully",
          savedStudent,
        });
      } catch (error: any) {
        console.error(`Error processing student with phone ${phone}:`, error.message);
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
    console.error("Error in main try block:", error.message);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
