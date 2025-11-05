import mongoose, { Schema } from "mongoose";
import {
  AvailableJobTypes,
  AvailableStatus,
  JobTypeEnum,
  StatusEnum,
} from "../constants";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },
    salary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    jobType: {
      type: String,
      enum: AvailableJobTypes,
      default: JobTypeEnum.FULL_TIME,
    },
    experienceRequired: {
      type: Number,
      default: 0,
      min: 0,
    },
    companyName: {
      type: String,
      trim: true,
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: AvailableStatus,
      default: StatusEnum.PENDING,
      index: true,
    },
    postedOn: {
      type: Date,
      default: Date.now,
      index: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
