/*
  Warnings:

  - A unique constraint covering the columns `[studentId,academicYearId,classStatus]` on the table `student_classes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "student_classes_studentId_academicYearId_key";

-- CreateIndex
CREATE UNIQUE INDEX "student_classes_studentId_academicYearId_classStatus_key" ON "student_classes"("studentId", "academicYearId", "classStatus");
