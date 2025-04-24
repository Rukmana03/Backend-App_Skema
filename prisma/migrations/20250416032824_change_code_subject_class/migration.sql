/*
  Warnings:

  - You are about to drop the column `code` on the `subject_classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subjectClassCode]` on the table `subject_classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectClassCode` to the `subject_classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "subject_classes_code_key";

-- AlterTable
ALTER TABLE "subject_classes" DROP COLUMN "code",
ADD COLUMN     "subjectClassCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subject_classes_subjectClassCode_key" ON "subject_classes"("subjectClassCode");
