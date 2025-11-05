import { body } from "express-validator";

const createJobValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Job title is required")
      .isLength({ min: 5, max: 100 })
      .withMessage("Title must be between 5 and 100 characters"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Job description is required")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters"),
    body("location").trim().notEmpty().withMessage("Location is required"),
  ];
};

export { createJobValidator };
