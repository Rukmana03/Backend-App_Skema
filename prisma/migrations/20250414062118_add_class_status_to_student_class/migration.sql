-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('Active', 'Promoted', 'Transferred', 'Graduated', 'DroppedOut');

-- AlterTable
ALTER TABLE "student_classes" ADD COLUMN     "classStatus" "ClassStatus" NOT NULL DEFAULT 'Active';
