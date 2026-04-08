const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const shelfSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        books: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }],
        isPublic: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

shelfSchema.plugin(paginate);

module.exports = mongoose.model("Shelf", shelfSchema);