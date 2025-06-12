require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const subjectClassRoutes = require("./routes/subjectClassRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const fileStorageRoutes = require("./routes/fileStorageRoutes");
const academicYearRoutes = require("./routes/academicYearRoutes");
const studentClassRoutes = require("./routes/studentClassRoutes")

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/class", classRoutes);
app.use("/api/student-class", studentClassRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/subject-class", subjectClassRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/files", fileStorageRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, "./docs/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Server berjalan!");
});

module.exports = app;
