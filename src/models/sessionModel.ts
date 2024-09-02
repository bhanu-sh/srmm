import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  },
  {
    timestamps: true,
  }
);

const Session =
  mongoose.models.sessions || mongoose.model("sessions", sessionSchema);

export default Session;
