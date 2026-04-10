const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const readingLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        status: {
            type: String,
            enum: ["want-to-read", "reading", "completed"],
            required: true
        },
        progress: {
            type: Number,
            min: 0,
            max: 10000,
            default: 0
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String
        },
        startDate: {
            type: Date
        },
        finishDate: {
            type: Date
        },
    },
    { timestamps: true }
);

readingLogSchema.plugin(paginate)

module.exports = mongoose.model("ReadingLog", readingLogSchema);