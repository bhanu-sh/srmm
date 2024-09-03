import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },
    name: {
      type: String,
    },
    father_name: {
      type: String,
    },
    mother_name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      default: "123",
    },
    role: {
      type: String,
      default: "Student",
    },
    roll_no: {
      type: String,
    },
    aadhar: {
      type: String,
    },
    date_of_admission: {
      type: Date,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sessions",
    },
    fees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fees",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.students || mongoose.model("students", studentSchema);

export default Student;
