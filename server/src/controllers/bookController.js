const asyncHandler = require("express-async-handler");

const { query, validationResult } = require("express-validator");

const Book = require("../models/Book");

const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

exports.getAll = [
    query('title').optional().trim(),
    query('author').optional().trim(),
    query('genre').optional().trim(),
    query('sort').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { author, genre, title, sort } = req.query;
        let filter = {};
        if (title)  filter.title  = new RegExp(title, "i");
        if (author) filter.author = new RegExp(author, "i");
        if (genre)  filter.genre  = new RegExp(genre, "i");

        const sortOption = sort ? { [sort]: "asc" } : { createdAt: "desc" };

        const bookPage = await Book
        .find(filter)
        .sort(sortOption)
        .lean()
        .paginate({ ...req.paginate, sort: sortOption });

        res
        .status(200)
        .links(generatePaginationLinks(
            req.originalUrl,
            req.paginate.page,
            bookPage.totalPages,
            req.paginate.limit
        ))
        .json(bookPage.docs);
    })
];

exports.get = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
});

exports.create = asyncHandler(async (req, res) => {
    const { title, author, genre, description, coverImage, isbn, publishedYear } = req.body;
    if (!title || !author) {
        return res.status(400).json({ error: "Title and author are required" });
    }
    const book = new Book({ title, author, genre, description, coverImage, isbn, publishedYear });
    await book.save();
    res.status(201).json(book);
});

exports.update = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
});

exports.remove = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
});