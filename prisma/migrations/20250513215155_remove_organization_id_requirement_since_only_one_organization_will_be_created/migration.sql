/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `JobTag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `JobTag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "JobTag" DROP CONSTRAINT "JobTag_organizationId_fkey";

-- DropIndex
DROP INDEX "JobTag_organizationId_name_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "JobTag" DROP COLUMN "organizationId";

-- CreateIndex
CREATE UNIQUE INDEX "JobTag_name_key" ON "JobTag"("name");
