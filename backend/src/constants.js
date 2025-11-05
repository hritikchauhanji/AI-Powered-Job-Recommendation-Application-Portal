export const DB_NAME = "job_portal_db";

export const UserRolesEnum = {
  CONDIDATE: "condidate",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const USER_COOKIE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export const JobTypeEnum = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const AvailableJobTypes = Object.values(JobTypeEnum);

export const StatusEnum = {
  ACTIVE: "active",
  CLOSED: "closed",
  PENDING: "pending",
  ARCHIVED: "archived",
  REVIEWED: "reviewed",
  SHORTLISTED: "shortlisted",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
};

export const AvailableStatus = Object.values(StatusEnum);
