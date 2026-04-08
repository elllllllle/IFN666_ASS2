const { body } = require("express-validator");

exports.register = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("Username must be between 3 and 50 characters")
        .isAlphanumeric().withMessage("Username must contain only letters and numbers"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.login = [
    body("username")
        .notEmpty().withMessage("Username is required"),
    body("password")
        .notEmpty().withMessage("Password is required"),
];