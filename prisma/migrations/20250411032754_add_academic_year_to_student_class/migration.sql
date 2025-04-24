/*
  Warnings:

  - A unique constraint covering the columns `[studentId,academicYearId]` on the table `student_classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYearId` to the `student_classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYearId` to the `subject_classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_classes" ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subject_classes" ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_year_key" ON "AcademicYear"("year");

-- CreateIndex
CREATE UNIQUE INDEX "student_classes_studentId_academicYearId_key" ON "student_classes"("studentId", "academicYearId");

-- AddForeignKey
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_classes" ADD CONSTRAINT "subject_classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
