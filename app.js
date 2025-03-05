require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoutes")

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/class", classRoutes);

app.get("/", (req, res) => {
    res.send("Server berjalan!");
});

module.exports = app;
