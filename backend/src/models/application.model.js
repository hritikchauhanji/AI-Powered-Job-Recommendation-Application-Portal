import mongoose, { Schema } from "mongoose";
import { AvailableStatus, StatusEnum } from "../constants.js";

const applicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: AvailableStatus,
      default: StatusEnum.PENDING,
      index: true,
    },
    coverLetter: {
      type: String,
    },
    appliedOn: {
      type: Date,
      default: Date.now,
      index: true,
    },
    reviewedOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
