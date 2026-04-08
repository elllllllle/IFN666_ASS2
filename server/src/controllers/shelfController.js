const asyncHandler = require("express-async-handler");

const { query, validationResult } = require("express-validator");

const Shelf = require("../models/Shelf");

const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

exports.getAll = [
    query('name').optional().trim(),
    query('sort').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { name, sort } = req.query;
        let filter = { owner: req.user.userId };
        if (name) filter.name = new RegExp(name, "i");

        const sortOption = sort ? { [sort]: "asc" } : { createdAt: "desc" };

        const shelfPage = await Shelf
        .find(filter)
        .sort(sortOption)
        .lean()
        .paginate({ ...req.paginate, sort: sortOption, populate: { path: "books" } });

        res
        .status(200)
        .links(generatePaginationLinks(
            req.originalUrl,
            req.paginate.page,
            shelfPage.totalPages,
            req.paginate.limit
        ))
        .json(shelfPage.docs);
    })
];

exports.get = asyncHandler(async (req, res) => {
    const shelf = await Shelf.findOne({ _id: req.params.id, owner: req.user.userId }).populate("books");
    if (!shelf) return res.status(404).json({ error: "Shelf not found" });
    res.status(200).json(shelf);
});

exports.create = asyncHandler(async (req, res) => {
    const { name, isPublic } = req.body;
    if (!name) return res.status(400).json({ error: "Shelf name is required" });
    const shelf = new Shelf({ name, isPublic, owner: req.user.userId, books: [] });
    await shelf.save();
    res.status(201).json(shelf);
});

exports.update = asyncHandler(async (req, res) => {
    const shelf = await Shelf.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.userId }, req.body, { returnDocument: 'after' }
    );
    if (!shelf) return res.status(404).json({ error: "Shelf not found" });
    res.status(200).json(shelf);
});

exports.remove = asyncHandler(async (req, res) => {
    const shelf = await Shelf.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!shelf) return res.status(404).json({ error: "Shelf not found" });
    res.status(200).json({ message: "Shelf deleted successfully" });
});

// Add book to shelf
exports.addBook = asyncHandler(async (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ error: "bookId is required" });

    const shelf = await Shelf.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.userId },
        { $addToSet: { books: bookId } },
        { returnDocument: 'after' }
    ).populate("books");

    if (!shelf) return res.status(404).json({ error: "Shelf not found" });
    res.status(200).json(shelf);
});

// Remove book from shelf
exports.removeBook = asyncHandler(async (req, res) => {
    const shelf = await Shelf.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.userId },
        { $pull: { books: req.params.bookId } },
        { returnDocument: 'after' }
    ).populate("books");
    if (!shelf) return res.status(404).json({ error: "Shelf not found" });
    res.status(200).json(shelf);
});