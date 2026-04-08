const express = require("express");
const router = express.Router();

const controller = require("../controllers/shelfController");

const authenticate = require("../middleware/authenticateToken");
const validateMongoId = require("../middleware/validateMongoId");
const { createShelf, updateShelf } = require("../middleware/shelfValidation");
const validate = require("../middleware/validate");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

router.route("/")
    .get(authenticate, validatePaginateQueryParams, controller.getAll)
    .post(authenticate, createShelf, validate, controller.create);

router.route("/:id")
    .get(authenticate, validateMongoId("id"), controller.get)
    .put(authenticate, validateMongoId("id"), updateShelf, validate, controller.update)
    .delete(authenticate, validateMongoId("id"), controller.remove);

router.post("/:id/books", authenticate, validateMongoId("id"), controller.addBook);
router.delete("/:id/books/:bookId", authenticate, validateMongoId("id"), controller.removeBook);

module.exports = router;