require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/class", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/grades", gradeRoutes);

app.get("/", (req, res) => {
    res.send("Server berjalan!");
});

module.exports = app;
