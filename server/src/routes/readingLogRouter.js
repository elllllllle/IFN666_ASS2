const express = require("express");
const router = express.Router();

const controller = require("../controllers/readingLogController");

const authenticate = require("../middleware/authenticateToken");
const validateMongoId = require("../middleware/validateMongoId");
const { createLog, updateLog } = require("../middleware/readingLogValidation");
const validate = require("../middleware/validate");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

router.route("/")
    .get(authenticate, validatePaginateQueryParams, controller.getAll)
    .post(authenticate, createLog, validate, controller.create);

router.route("/:id")
    .get(authenticate, validateMongoId("id"), controller.get)
    .put(authenticate, validateMongoId("id"), updateLog, validate, controller.update)
    .delete(authenticate, validateMongoId("id"), controller.remove);

module.exports = router;