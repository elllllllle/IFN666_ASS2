const express = require("express");
const router = express.Router();

const controller = require("../controllers/bookController");

const authenticate = require("../middleware/authenticateToken");
const validateMongoId = require("../middleware/validateMongoId");
const { createBook, updateBook } = require("../middleware/bookValidation");
const validate = require("../middleware/validate");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

router.route("/")
    .get(validatePaginateQueryParams, controller.getAll)
    .post(authenticate, createBook, validate, controller.create);

router.route("/:id")
    .get(validateMongoId("id"), controller.get)
    .put(authenticate, validateMongoId("id"), updateBook, validate, controller.update)
    .delete(authenticate, validateMongoId("id"), controller.remove);

module.exports = router;