const express = require("express");
const router = express.Router();

const authRouter = require("./authRouter");
const bookRouter = require("./bookRouter");
const readingLogRouter = require("./readingLogRouter");
const shelfRouter = require("./shelfRouter");

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/reading-logs", readingLogRouter);
router.use("/shelves", shelfRouter);

module.exports = router;