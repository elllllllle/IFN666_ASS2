const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: String
        },
        description: {
            type: String
        },
        coverImage: {
            type: String
        },
        isbn: {
            type: String
        },
        publishedYear: {
            type: Number
        },
    },
    { timestamps: true }
);

bookSchema.plugin(paginate);

module.exports = mongoose.model("Book", bookSchema);