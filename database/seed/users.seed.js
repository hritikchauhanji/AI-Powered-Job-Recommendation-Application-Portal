import bcrypt from "bcrypt";

export default [
  {
    name: "Alice Smith",
    email: "alice@example.com",
    username: "alice",
    role: "condidate",
    skills: ["React", "Node.js", "MongoDB"],
    experience: 1,
    location: "Bengaluru",
    education: "B.Tech Computer Science",
    resume: "https://example.com/resume/alice.pdf",
    profileImage: {
      url: "https://randomuser.me/api/portraits/women/1.jpg",
      public_id: "profiles/alice",
    },
    password: bcrypt.hashSync("password123", 10),
  },
  {
    name: "Bob Recruiter",
    email: "bob@company.com",
    username: "bobrecruit",
    role: "recruiter",
    skills: ["HR", "Recruitment"],
    experience: 5,
    location: "Mumbai",
    education: "MBA",
    password: bcrypt.hashSync("password123", 10),
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    username: "admin",
    role: "admin",
    skills: [],
    experience: 10,
    location: "Delhi",
    education: "M.Tech",
    password: bcrypt.hashSync("admin123", 10),
  },
];
