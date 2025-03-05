/*
  Warnings:

  - You are about to drop the column `teacherId` on the `classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_teacherId_fkey";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "teacherId";

-- CreateTable
CREATE TABLE "teacher_classes" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "teacher_classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_classes_teacherId_classId_key" ON "teacher_classes"("teacherId", "classId");

-- AddForeignKey
ALTER TABLE "teacher_classes" ADD CONSTRAINT "teacher_classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_classes" ADD CONSTRAINT "teacher_classes_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
