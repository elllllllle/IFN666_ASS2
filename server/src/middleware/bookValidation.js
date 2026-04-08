const { body } = require("express-validator");

exports.createBook = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .trim()
        .isLength({ max: 200 }).withMessage("Title must be under 200 characters"),
    body("author")
        .notEmpty().withMessage("Author is required")
        .trim()
        .isLength({ max: 100 }).withMessage("Author must be under 100 characters"),
    body("genre")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Genre must be under 50 characters"),
    body("publishedYear")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage("Published year must be a valid year"),
    body("isbn")
        .optional()
        .trim()
        .isLength({ min: 10, max: 13 }).withMessage("ISBN must be 10 or 13 characters"),
];

exports.updateBook = [
    body("title")
        .optional()
        .trim()
        .notEmpty().withMessage("Title cannot be empty")
        .isLength({ max: 200 }).withMessage("Title must be under 200 characters"),
    body("author")
        .optional()
        .trim()
        .notEmpty().withMessage("Author cannot be empty")
        .isLength({ max: 100 }).withMessage("Author must be under 100 characters"),
    body("genre")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Genre must be under 50 characters"),
    body("publishedYear")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage("Published year must be a valid year"),
];