const { body } = require("express-validator");

exports.createLog = [
    body("book")
        .notEmpty().withMessage("Book ID is required")
        .isMongoId().withMessage("Book must be a valid ID"),
    body("status")
        .notEmpty().withMessage("Status is required")
        .isIn(["want-to-read", "reading", "completed"])
        .withMessage("Status must be want-to-read, reading, or completed"),
    body("progress")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Progress must be between 0 and 100"),
    body("rating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("review")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("Review must be under 2000 characters"),
];

exports.updateLog = [
    body("status")
        .optional()
        .isIn(["want-to-read", "reading", "completed"])
        .withMessage("Status must be want-to-read, reading, or completed"),
    body("progress")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Progress must be between 0 and 100"),
    body("rating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("review")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("Review must be under 2000 characters"),
    ];