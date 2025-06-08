/*
  Warnings:

  - You are about to drop the column `jobStatus` on the `Job` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'REVIEWING', 'INTERVIEWING', 'HIRED', 'REJECTED');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobStatus",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING';
