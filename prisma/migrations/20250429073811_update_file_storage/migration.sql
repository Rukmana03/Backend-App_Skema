/*
  Warnings:

  - You are about to drop the `assignment_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_files` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignmentId` to the `file_storages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `file_storages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `file_storages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('Assignment', 'Submission');

-- DropForeignKey
ALTER TABLE "assignment_files" DROP CONSTRAINT "assignment_files_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "assignment_files" DROP CONSTRAINT "assignment_files_fileId_fkey";

-- DropForeignKey
ALTER TABLE "submission_files" DROP CONSTRAINT "submission_files_fileId_fkey";

-- DropForeignKey
ALTER TABLE "submission_files" DROP CONSTRAINT "submission_files_submissionId_fkey";

-- AlterTable
ALTER TABLE "file_storages" ADD COLUMN     "assignmentId" INTEGER NOT NULL,
ADD COLUMN     "fileType" "FileType" NOT NULL,
ADD COLUMN     "submissionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "assignment_files";

-- DropTable
DROP TABLE "submission_files";

-- AddForeignKey
ALTER TABLE "file_storages" ADD CONSTRAINT "file_storages_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_storages" ADD CONSTRAINT "file_storages_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
