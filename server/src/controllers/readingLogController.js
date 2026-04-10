const asyncHandler = require("express-async-handler");

const { query, validationResult } = require("express-validator");

const ReadingLog = require("../models/ReadingLog");

const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

exports.getAll = [
    query('status').optional().trim(),
    query('sort').optional().trim(),
    query('book').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const { status, sort, book } = req.query;
        let filter = { user: req.user.userId };
        if (status) filter.status = status;
        if (book) filter.book = book;
        const sortOption = sort ? { [sort]: "asc" } : { createdAt: "desc" };
        const logPage = await ReadingLog
        .find(filter)
        .sort(sortOption)
        .lean()
        .paginate({ ...req.paginate, sort: sortOption, populate: { path: "book" } });
        res
        .status(200)
        .links(generatePaginationLinks(
            req.originalUrl,
            req.paginate.page,
            logPage.totalPages,
            req.paginate.limit
        ))
        .json(logPage.docs);
  })
];

exports.get = asyncHandler(async (req, res) => {
    const log = await ReadingLog.findOne({ _id: req.params.id, user: req.user.userId }).populate("book");
    if (!log) return res.status(404).json({ error: "Reading log not found"});
    res.status(200).json(log);
});

exports.create = asyncHandler(async (req, res) => {
  const { book, status, progress, rating, review, startDate, finishDate } = req.body
  if (!book || !status) {
    return res.status(400).json({ error: 'Book and status are required' })
  }

  // Check for duplicate
  const existing = await ReadingLog.findOne({ user: req.user.userId, book })
  if (existing) {
    return res.status(409).json({ error: 'This book is already in your reading log' })
  }

  const log = new ReadingLog({
    user: req.user.userId,
    book, status, progress, rating, review, startDate, finishDate,
  })
  await log.save()
  res.status(201).json(log)
})

exports.update = asyncHandler(async (req, res) => {
    const log = await ReadingLog.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId }, req.body, { returnDocument: 'after' }
    );
    if (!log) return res.status(404).json({ error: "Reading log not found" });
    res.status(200).json(log);
});

exports.remove = asyncHandler(async (req, res) => {
    const log = await ReadingLog.findOneAndDelete({ _id: req.params.id, user: req.user.userId});
    if (!log) return res.status(404).json({ error: " reading log not found" });
    res.status(200).json({ message: "Reading log deleted successfully" });
});