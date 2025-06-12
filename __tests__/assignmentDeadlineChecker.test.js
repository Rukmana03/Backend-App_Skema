const checkAssignmentDeadlines = require("../scheduler/assignmentDeadlineChecker");

const scheduleRepository = require("../repositories/scheduleRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService");

jest.mock("../repositories/scheduleRepository");
jest.mock("../repositories/assignmentRepository");
jest.mock("../services/notificationService");

describe("Assignment Deadline Checker", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should send 24-hour reminders and update status", async () => {
        const assignments24h = [
            { id: 1, title: "Tugas Bahasa" },
            { id: 2, title: "Tugas Fisika" },
        ];
        const students = [{ studentId: 9 }, { studentId: 10 }];

        scheduleRepository.getAssignmentsFor24hReminder.mockResolvedValue(assignments24h);
        scheduleRepository.getAssignmentsFor2hReminder.mockResolvedValue([]);
        assignmentRepository.getStudentsByAssignmentId.mockResolvedValue(students);
        notificationService.sendNotification.mockResolvedValue();
        scheduleRepository.mark24hNotified.mockResolvedValue();

        await checkAssignmentDeadlines();

        expect(scheduleRepository.getAssignmentsFor24hReminder).toHaveBeenCalledTimes(1);
        expect(notificationService.sendNotification).toHaveBeenCalledWith(9, expect.stringContaining("24 jam"));
        expect(notificationService.sendNotification).toHaveBeenCalledWith(10, expect.stringContaining("24 jam"));
        expect(scheduleRepository.mark24hNotified).toHaveBeenCalledWith(1);
        expect(scheduleRepository.mark24hNotified).toHaveBeenCalledWith(2);
    });

    it("should send 2-hour reminders and update status", async () => {
        const assignments2h = [
            { id: 3, title: "Tugas Matematika" },
        ];
        const students = [{ studentId: 12 }, { studentId: 11 }];

        scheduleRepository.getAssignmentsFor24hReminder.mockResolvedValue([]);
        scheduleRepository.getAssignmentsFor2hReminder.mockResolvedValue(assignments2h);
        assignmentRepository.getStudentsByAssignmentId.mockResolvedValue(students);
        notificationService.sendNotification.mockResolvedValue();
        scheduleRepository.mark2hNotified.mockResolvedValue();

        await checkAssignmentDeadlines();

        expect(scheduleRepository.getAssignmentsFor2hReminder).toHaveBeenCalledTimes(1);
        expect(notificationService.sendNotification).toHaveBeenCalledWith(12, expect.stringContaining("2 jam"));
        expect(notificationService.sendNotification).toHaveBeenCalledWith(11, expect.stringContaining("2 jam"));
        expect(scheduleRepository.mark2hNotified).toHaveBeenCalledWith(3);
    });

    it("should not send notifications if no upcoming deadlines", async () => {
        scheduleRepository.getAssignmentsFor24hReminder.mockResolvedValue([]);
        scheduleRepository.getAssignmentsFor2hReminder.mockResolvedValue([]);

        await checkAssignmentDeadlines();

        expect(notificationService.sendNotification).not.toHaveBeenCalled();
        expect(scheduleRepository.mark24hNotified).not.toHaveBeenCalled();
        expect(scheduleRepository.mark2hNotified).not.toHaveBeenCalled();
    });
});
