import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    receipt_no: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["received", "fee"],
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "cheque", "online"],
    },
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colleges",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Fee = mongoose.models.fees || mongoose.model("fees", feeSchema);

export default Fee;
