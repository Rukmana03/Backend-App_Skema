-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "notifiedBefore24h" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifiedBefore2h" BOOLEAN NOT NULL DEFAULT false;
