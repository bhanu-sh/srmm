import { connect } from "@/dbConfig/dbConfig";
import Student from "@/models/studentModel";
import Fee from "@/models/feeModel";
import Course from "@/models/courseModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  connect();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reqBody = await request.json();
    const { user } = reqBody;

    if (!Array.isArray(user) || user.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty User array provided" },
        { status: 400 }
      );
    }

    const results = [];
    const batchSize = 50; // Customize batch size to suit your server's limits

    for (let i = 0; i < user.length; i += batchSize) {
      const batch = user.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (user_id) => {
          try {
            const userExist = await Student.findById(user_id);

            if (!userExist) {
              return {
                user_id,
                status: "error",
                message: "User does not exist",
              };
            }

            // Delete fee records associated with the student
            await Fee.deleteMany({ student_id: user_id });

            // Remove the student from all enrolled courses
            const courses = await Course.find({ students: user_id });
            await Promise.all(
              courses.map(async (course) => {
                course.students = course.students.filter(
                  (student_id: { toString: () => any; }) => student_id.toString() !== user_id
                );
                await course.save();
              })
            );

            // Delete the student record
            await Student.deleteOne({ _id: user_id });

            return {
              user_id,
              status: "success",
              message: "User deleted successfully",
            };
          } catch (error: any) {
            return { user_id, status: "error", message: error.message };
          }
        })
      );

      results.push(...batchResults); // Collect results for the batch
    }

    return NextResponse.json({ data: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
