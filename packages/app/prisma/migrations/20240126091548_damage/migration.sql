/*
  Warnings:

  - Added the required column `damage` to the `PingResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PingResult" ADD COLUMN     "damage" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "basePoints" INTEGER,
ADD COLUMN     "damagePerHit" INTEGER;
