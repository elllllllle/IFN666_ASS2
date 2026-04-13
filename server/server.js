const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRouter = require("./src/routes/index");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors({
  origin: '*',
  exposedHeaders: ['Link']
}))

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/reading-tracker")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", apiRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

module.exports = app;