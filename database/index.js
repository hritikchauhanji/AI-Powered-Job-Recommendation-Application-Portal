import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

import userSeeds from "./seed/users.seed.js";
import jobSeeds from "./seed/jobs.seed.js";
import applicationSeeds from "./seed/applications.seed.js";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await User.deleteMany({});
  const users = await User.insertMany(userSeeds);

  for (const job of jobSeeds) {
    const recruiter = users.find((u) => u.role === "recruiter");
    if (recruiter) job.recruiterId = recruiter._id;
  }

  await Job.deleteMany({});
  const jobs = await Job.insertMany(jobSeeds);

  if (users.length && jobs.length) {
    applicationSeeds.push({
      userId: users.find((u) => u.role === "condidate")._id,
      jobId: jobs[0]._id,
      status: "applied",
      applied_on: new Date(),
    });
  }

  // Applications
  await Application.deleteMany({});
  await Application.insertMany(applicationSeeds);

  await mongoose.disconnect();
  console.log("Database seeded!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
