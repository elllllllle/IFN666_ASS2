const mongoose = require("mongoose");

const validateMongoId = (paramName) => (req, res, next) => {
    const id = req.params && req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid MongoDB ObjectID" });
    }
    next();
};

module.exports = validateMongoId;