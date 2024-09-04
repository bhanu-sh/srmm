import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    session_start: {
      type: Number,
      required: true,
    },
    session_end: {
      type: Number,
      required: true,
    },
    course_fee: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course =
  mongoose.models.courses || mongoose.model("courses", courseSchema);

export default Course;
