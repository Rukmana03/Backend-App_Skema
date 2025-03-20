/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "fileUrl";

-- CreateTable
CREATE TABLE "assignment_files" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "assignment_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_files" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "submission_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignment_files" ADD CONSTRAINT "assignment_files_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_files" ADD CONSTRAINT "assignment_files_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file_storages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file_storages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
