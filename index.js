require("dotenv").config();
const cron = require("node-cron");
const app = require("./app");
const checkAssignmentDeadlines = require("./scheduler/assignmentDeadlineChecker");

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

cron.schedule("0 */2 * * *", async () => {
    console.log("[Scheduler] Mengecek deadline tugas setiap 2 jam...");
    await checkAssignmentDeadlines();
});