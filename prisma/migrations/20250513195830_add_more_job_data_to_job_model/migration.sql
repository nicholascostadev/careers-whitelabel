/*
  Warnings:

  - Added the required column `city` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentType` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobStatus` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workplaceLocation` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkplaceLocation" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "employmentType" "EmploymentType" NOT NULL,
ADD COLUMN     "jobStatus" "JobStatus" NOT NULL,
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "workplaceLocation" "WorkplaceLocation" NOT NULL,
ADD COLUMN     "zipCode" TEXT;

-- CreateTable
CREATE TABLE "JobTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT,
    "jobId" TEXT,

    CONSTRAINT "JobTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTag_organizationId_name_key" ON "JobTag"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "JobTag" ADD CONSTRAINT "JobTag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTag" ADD CONSTRAINT "JobTag_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
