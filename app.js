require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Gunakan authRoutes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server berjalan!");
});

module.exports = app;
