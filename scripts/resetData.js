const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetData() {
    try {
        // 1. Hapus semua data (urutan penting!)
        await prisma.assignmentFile.deleteMany();
        await prisma.submissionFile.deleteMany();
        await prisma.fileStorage.deleteMany();
        await prisma.comment.deleteMany();
        await prisma.grade.deleteMany();
        await prisma.submission.deleteMany();
        await prisma.assignment.deleteMany();
        await prisma.subjectClass.deleteMany();
        await prisma.studentClass.deleteMany();
        await prisma.subject.deleteMany();
        await prisma.class.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.user.deleteMany();
        await prisma.school.deleteMany();

        // 2. Reset auto-increment (sequence) ke 1
        const sequences = [
            "users_id_seq",
            "schools_id_seq",
            "classes_id_seq",
            "student_classes_id_seq",
            "subjects_id_seq",
            "subject_classes_id_seq",
            "assignments_id_seq",
            "submissions_id_seq",
            "grades_id_seq",
            "comments_id_seq",
            "notifications_id_seq",
            "file_storages_id_seq",
            "assignment_files_id_seq",
            "submission_files_id_seq",
            "profiles_id_seq"
        ];

        for (const seq of sequences) {
            await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seq}" RESTART WITH 1`);
        }

        console.log("✅ Semua data dihapus dan sequence ID disetel ulang ke 1.");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

resetData();
