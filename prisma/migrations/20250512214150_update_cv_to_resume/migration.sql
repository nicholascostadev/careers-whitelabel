/*
  Warnings:

  - You are about to drop the column `cvURL` on the `JobApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "cvURL",
ADD COLUMN     "resumeURL" TEXT;
