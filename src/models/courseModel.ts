import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colleges",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.courses || mongoose.model("courses", courseSchema);

export default Course;
