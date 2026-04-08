const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");

const { register, login } = require("../middleware/authValidation");
const validate = require("../middleware/validate");

router.post("/register", register, validate, controller.register);
router.post("/login", login, validate, controller.login);

module.exports = router;