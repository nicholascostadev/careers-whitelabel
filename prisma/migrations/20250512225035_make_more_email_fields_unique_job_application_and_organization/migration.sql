/*
  Warnings:

  - A unique constraint covering the columns `[jobId,email]` on the table `JobApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobId_email_key" ON "JobApplication"("jobId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");
