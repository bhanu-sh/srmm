import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      f_name,
      l_name,
      phone,
      password,
      dob,
      address,
      city,
      state,
      pincode,
      college_id,
    } = reqBody;

    console.log(reqBody);

    // Check if User already exists
    const user = await User.findOne({ phone });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new User
    const newUser = new User({
      f_name,
      l_name,
      phone,
      dob,
      address,
      city,
      state,
      pincode,
      college_id,
      password: hashedPassword,
      role: "Staff",
    });

    // Save User
    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
