-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Teacher', 'Student');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('Daily', 'Weekly');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Pending', 'Submitted', 'Graded');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Unread', 'Read');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "fcmToken" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "foto_profile" TEXT,
    "bio" TEXT,
    "identity_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Class" (
    "class_id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "class_name" TEXT NOT NULL,
    "teacher_id" INTEGER,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "StudentClass" (
    "student_class_id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentClass_pkey" PRIMARY KEY ("student_class_id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "subject_id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignment_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "assignment_type" "AssignmentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submission_id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "file_url" TEXT,
    "submission_date" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "grade_id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "feedback" TEXT,
    "graded_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("grade_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "comment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "sent_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "FileStorage" (
    "file_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "FileStorage_pkey" PRIMARY KEY ("file_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_identity_number_key" ON "Profile"("identity_number");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("assignment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("assignment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileStorage" ADD CONSTRAINT "FileStorage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
