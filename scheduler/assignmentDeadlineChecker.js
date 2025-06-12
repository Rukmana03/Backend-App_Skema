const scheduleRepository = require("../repositories/scheduleRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService");

const sendReminderBatch = async (assignments, hoursLabel, markNotifiedFn) => {
    for (const assignment of assignments) {
        try {
            const students = await assignmentRepository.getStudentsByAssignmentId(assignment.id);

            for (const student of students) {
                await notificationService.sendNotification(
                    student.studentId,
                    `Task "${assignment.title}" will end in ${hoursLabel}!`
                );
            }

            await markNotifiedFn(assignment.id);
            console.log(`[Scheduler] Notification ${hoursLabel} sent for assignment ID ${assignment.id}`);
        } catch (error) {
            console.error(`[Scheduler] Failed notification ${hoursLabel} For assignment ID ${assignment.id}:`, error);
        }
    }
};

const checkAssignmentDeadlines = async () => {
    console.log("[Scheduler]Check the task deadline...");

    const now = new Date();

    const upcoming24h = await scheduleRepository.getAssignmentsFor24hReminder(now);
    await sendReminderBatch(upcoming24h, "24 jam", scheduleRepository.mark24hNotified);

    const upcoming2h = await scheduleRepository.getAssignmentsFor2hReminder(now);
    await sendReminderBatch(upcoming2h, "2 jam", scheduleRepository.mark2hNotified);
};

module.exports = checkAssignmentDeadlines;
