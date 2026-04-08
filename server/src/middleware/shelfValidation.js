const { body } = require("express-validator");

exports.createShelf = [
    body("name")
        .notEmpty().withMessage("Shelf name is required")
        .trim()
        .isLength({ max: 100 }).withMessage("Shelf name must be under 100 characters"),
    body("isPublic")
        .optional()
        .isBoolean().withMessage("isPublic must be true or false"),
];

exports.updateShelf = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Shelf name cannot be empty")
        .isLength({ max: 100 }).withMessage("Shelf name must be under 100 characters"),
    body("isPublic")
        .optional()
        .isBoolean().withMessage("isPublic must be true or false"),
];