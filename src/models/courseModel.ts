import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sessions",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course =
  mongoose.models.courses || mongoose.model("courses", courseSchema);

export default Course;
