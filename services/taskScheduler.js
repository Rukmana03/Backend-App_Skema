const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService");

const checkAssignmentDeadlines = async () => {
    console.log("[Scheduler] Mengecek deadline tugas...");

    const now = new Date();
    const upcomingDeadlines = await assignmentRepository.getAssignmentsWithUpcomingDeadlines(now);

    for (const assignment of upcomingDeadlines) {
        console.log(`[Scheduler] Tugas: ${assignment.title} akan segera berakhir!`);

        const students = await assignmentRepository.getStudentsByAssignmentId(assignment.id);
        for (const student of students) {
            console.log(`[Scheduler] Mengirim notifikasi ke siswa ID: ${student.studentId}`);
            await notificationService.sendNotification(
                student.studentId,
                `Tugas "${assignment.title}" akan segera berakhir!`
            );
        }
    }
};

// Jalankan setiap 1 jam
setInterval(checkAssignmentDeadlines, 60 * 60 * 1000);
