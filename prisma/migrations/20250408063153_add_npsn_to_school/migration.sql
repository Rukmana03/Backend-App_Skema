/*
  Warnings:

  - A unique constraint covering the columns `[npsn]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `npsn` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "npsn" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schools_npsn_key" ON "schools"("npsn");
